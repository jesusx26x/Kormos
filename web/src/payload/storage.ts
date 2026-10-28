import { del } from "@vercel/blob";
import { APIError, type CollectionBeforeOperationHook, type Payload, type PayloadRequest } from "payload";
import { MAX_UPLOAD_BYTES, STORAGE_BLOCK, STORAGE_FULL_MESSAGE, STORAGE_LIMIT, STORAGE_WARN, tooBigMessage, type StorageUsage } from "./storageLimits";

export * from "./storageLimits";

/**
 * Suma de lo que ocupan las fotos y los archivos según la base. Puede quedarse
 * un poco corta frente a Vercel (archivos huérfanos), de ahí el margen del 90 %.
 */
export async function getStorageUsage(payload: Payload): Promise<StorageUsage> {
  const sums = await Promise.all(
    (["fotos", "archivos"] as const).map(async (collection) => {
      const { docs } = await payload.find({ collection, pagination: false, depth: 0, select: { filesize: true }, overrideAccess: true });
      return docs.reduce((total, d) => total + (d.filesize ?? 0), 0);
    }),
  );
  const used = sums.reduce((a, b) => a + b, 0);
  const ratio = used / STORAGE_LIMIT;
  return { used, limit: STORAGE_LIMIT, ratio, level: ratio >= STORAGE_BLOCK ? "full" : ratio >= STORAGE_WARN ? "warn" : "ok" };
}

/** Antes de dar permiso para subir directo a Blob: con el espacio lleno no se sube nada. */
export async function canStartUpload({ req }: { req: PayloadRequest }) {
  if (!req.user) return false;
  if ((await getStorageUsage(req.payload)).level === "full") throw new APIError(STORAGE_FULL_MESSAGE, 400, null, true);
  return true;
}

/**
 * Rechaza un archivo demasiado grande o que no cabe. Con subida directa el
 * archivo ya está en Blob cuando llega aquí: se borra para que no ocupe espacio
 * sin que ninguna ficha lo use.
 */
export const guardUpload: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== "create" && operation !== "update") return args;
  const file = req.file;
  if (!file) return args;
  const size = file.size ?? 0;
  let message: string | null = null;
  if (size > MAX_UPLOAD_BYTES) message = tooBigMessage(size);
  else if ((await getStorageUsage(req.payload)).used + size > STORAGE_LIMIT * STORAGE_BLOCK) message = STORAGE_FULL_MESSAGE;
  if (!message) return args;

  if (file.clientUploadContext && process.env.BLOB_READ_WRITE_TOKEN) {
    const data = (args.data ?? {}) as { prefix?: string | null; _objectKey?: string | null };
    const pathname = [data.prefix, data._objectKey, file.name].filter(Boolean).join("/");
    await del(pathname, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch((err) =>
      req.payload.logger.error({ err, pathname }, "No se pudo borrar de Blob un archivo rechazado"),
    );
  }
  throw new APIError(message, 400, null, true);
};
