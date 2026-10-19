// Vuelve a subir a Vercel Blob las fotos que la base registra pero que no
// están en Blob, tomándolas de public/ (las fotos de muestra viven ahí).
// Corre en cada publicación, antes de `next build`: comprueba cada foto y no
// hace nada si ya están todas. Las que subió el cliente desde el panel no
// están en public/: si alguna faltara, se avisa en el registro y se sigue.
//
// Uso:   npm run archivos:reparar
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";
import { getPayload } from "payload";
import configModule from "../src/payload.config";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms).unref());
const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.log("Sin Vercel Blob (BLOB_READ_WRITE_TOKEN): nada que revisar.");
  process.exit(0);
}

const local = new Map<string, string>();
(function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else local.set(entry.name, full);
  }
})(path.join(WEB, "public"));

const config = (configModule as unknown as { default?: typeof configModule }).default ?? configModule;

try {
  const payload = await getPayload({ config });
  for (const collection of ["fotos", "archivos"] as const) {
    const { docs } = await payload.find({ collection, limit: 0, pagination: false, depth: 0 });
    let present = 0;
    let uploaded = 0;
    const missing: string[] = [];
    // Una a la vez: Blob limita las subidas por segundo
    for (const doc of docs) {
      if (!doc.url || !doc.filename) continue;
      const found = await fetch(doc.url, { method: "HEAD", signal: AbortSignal.timeout(15_000) }).then((r) => r.ok, () => null);
      if (found === null) {
        console.warn(`No se pudo comprobar ${doc.filename}`);
        continue;
      }
      if (found) {
        present++;
        continue;
      }
      const file = local.get(doc.filename);
      if (!file) {
        missing.push(doc.filename);
        continue;
      }
      try {
        const upload = put(decodeURIComponent(new URL(doc.url).pathname.slice(1)), fs.readFileSync(file), {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
          contentType: doc.mimeType ?? undefined,
          token,
        });
        // Sin red hacia Blob, put reintenta sin fin y detendría la publicación
        await Promise.race([upload, wait(60_000).then(() => Promise.reject(new Error("Blob no respondió en 60 s")))]);
        uploaded++;
      } catch (err) {
        // Si Blob falla una vez, lo más probable es que falle con todas: se
        // deja para la próxima publicación en vez de alargar esta
        console.error(`No se pudo subir ${doc.filename}:`, err instanceof Error ? err.message : err);
        break;
      }
    }
    console.log(`${collection}: ${docs.length} en total, ${present} ya estaban, ${uploaded} subidas de nuevo.`);
    if (missing.length) console.warn(`${collection} sin copia local (hay que subirlas desde el panel): ${missing.join(", ")}`);
  }
} catch (err) {
  // Revisar las fotos nunca debe impedir que el sitio se publique
  console.error("No se pudieron revisar las fotos:", err instanceof Error ? err.message : err);
}
process.exit(0);
