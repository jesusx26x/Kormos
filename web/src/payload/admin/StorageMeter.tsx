import Link from "next/link";
import type { Payload } from "payload";
import { getStorageUsage, STORAGE_BLOCK, STORAGE_FULL_MESSAGE, STORAGE_WARN, type StorageUsage } from "../storage";
import styles from "./admin.module.css";

const mb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1_000_000)).toLocaleString("es-DO")} MB`;

const MESSAGES: Record<Exclude<StorageUsage["level"], "ok">, string> = {
  warn: `Ya se usa más del ${STORAGE_WARN * 100} %. Borra las fotos o archivos que ya no se usen: al llegar al ${STORAGE_BLOCK * 100} % el panel deja de aceptar archivos nuevos.`,
  full: STORAGE_FULL_MESSAGE,
};

/** Aviso de espacio: solo se muestra desde el 70 %, nunca con espacio de sobra. */
export function StorageMeter({ usage }: { usage: StorageUsage & { level: "warn" | "full" } }) {
  const percent = Math.min(100, Math.round(usage.ratio * 100));
  return (
    <section className={styles.storage} data-level={usage.level} aria-labelledby="espacio">
      <header className={styles.storageHead}>
        <h2 id="espacio" className={styles.storageTitle}>
          Espacio para fotos y archivos
        </h2>
        <span className={styles.storageFigure}>
          {mb(usage.used)} de 1 GB · {percent} %
        </span>
      </header>
      <div
        className={styles.storageBar}
        role="meter"
        aria-label="Espacio usado"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <span style={{ width: `${Math.max(percent, 1)}%` }} />
      </div>
      <p className={styles.storageText}>
        {MESSAGES[usage.level]} <Link href="/admin/collections/fotos?sort=-filesize">Ver las fotos más pesadas →</Link>
      </p>
    </section>
  );
}

/** Encima de las listas de fotos y archivos: solo aparece cuando el espacio empieza a escasear. */
export async function StorageNotice({ payload }: { payload: Payload }) {
  const usage = await getStorageUsage(payload);
  return usage.level === "ok" ? null : <StorageMeter usage={{ ...usage, level: usage.level }} />;
}
