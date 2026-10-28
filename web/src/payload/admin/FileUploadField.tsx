"use client";

import { toast, useField, useUploadHandlers } from "@payloadcms/ui";
import type { UploadFieldClientComponent } from "payload";
import { useEffect, useRef, useState } from "react";
import { MAX_UPLOAD_BYTES, STORAGE_BLOCK, STORAGE_FULL_MESSAGE, tooBigMessage, type StorageUsage } from "../storageLimits";
import styles from "./admin.module.css";

type Archivo = { id: number; filename: string; filesize?: number | null; url?: string | null };

const sizeFmt = (bytes?: number | null) =>
  !bytes ? "" : bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * Archivo de descarga de la pieza (.skp, .dwg o .pdf) en un solo paso: el
 * botón abre el explorador, sube el archivo y lo deja puesto en la ficha. El
 * campo de Payload pedía abrir una ventana, elegir el archivo y guardar aparte.
 */
export const FileUploadField: UploadFieldClientComponent = (props) => {
  const { path, field } = props;
  // clientProps de la configuración llegan como props sueltas
  const format = String((props as { format?: string }).format ?? "");
  const { value, setValue } = useField<number | null>({ path });
  const { getUploadHandler } = useUploadHandlers();
  const input = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState<Archivo | null>(null);
  const file = value && loaded?.id === value ? loaded : null;
  const [uploading, setUploading] = useState(false);
  const label = typeof field.label === "string" ? field.label : format.toUpperCase();

  useEffect(() => {
    if (!value) return;
    let alive = true;
    fetch(`/api/archivos/${value}?depth=0`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setLoaded(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [value]);

  async function upload(chosen: File) {
    if (!chosen.name.toLowerCase().endsWith(`.${format}`)) {
      toast.error(`Este campo es para archivos .${format}. Elegiste "${chosen.name}".`);
      return;
    }
    // Antes de subir: rechazado después, el archivo ya habría ocupado espacio
    if (chosen.size > MAX_UPLOAD_BYTES) {
      toast.error(tooBigMessage(chosen.size));
      return;
    }
    setUploading(true);
    try {
      const space: Partial<StorageUsage> = await fetch("/api/espacio", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({}));
      if (space.level === "full" || (space.used ?? 0) + chosen.size > (space.limit ?? Infinity) * STORAGE_BLOCK) {
        toast.error(STORAGE_FULL_MESSAGE);
        return;
      }
      // Publicado, el archivo va directo del navegador a Vercel Blob (Vercel no
      // deja pasar más de 4.5 MB por el servidor); en local, al servidor
      const handler = getUploadHandler({ collectionSlug: "archivos" });
      let filePart: Blob | string = chosen;
      if (handler) {
        let filename = chosen.name;
        const clientUploadContext = await handler({
          file: chosen,
          updateFilename: (v: string) => {
            filename = v;
          },
        });
        filePart = JSON.stringify({ clientUploadContext, collectionSlug: "archivos", filename, mimeType: chosen.type, size: chosen.size });
      }
      const body = new FormData();
      body.append("_payload", "{}");
      body.append("file", filePart);
      const res = await fetch("/api/archivos?depth=0", { method: "POST", body, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.doc) {
        toast.error(data.errors?.[0]?.message ?? "No se pudo subir el archivo. Inténtalo de nuevo.");
        return;
      }
      setValue(data.doc.id);
      toast.success("Archivo listo. Guarda la ficha para publicarlo.");
    } catch {
      toast.error("No se pudo subir el archivo. Revisa la conexión e inténtalo de nuevo.");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className={`field-type ${styles.fileField}`}>
      <p className={styles.fileLabel}>{label}</p>
      {file ? (
        <p className={styles.fileName}>
          {file.url ? (
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.filename}
            </a>
          ) : (
            file.filename
          )}
          {file.filesize ? <span> · {sizeFmt(file.filesize)}</span> : null}
        </p>
      ) : null}
      <div className={styles.fileActions}>
        <button type="button" className={styles.notifyButton} disabled={uploading} onClick={() => input.current?.click()}>
          {uploading ? "Subiendo…" : file ? "Cambiar archivo" : "Elegir archivo"}
        </button>
        {file && !uploading ? (
          <button type="button" className={styles.fileRemove} onClick={() => setValue(null)}>
            Quitar
          </button>
        ) : null}
      </div>
      {uploading ? <p className={styles.readyHint}>Un archivo grande puede tardar unos minutos. No cierres esta página.</p> : null}
      <input ref={input} type="file" accept={`.${format}`} hidden onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])} />
    </div>
  );
};
