import Link from "next/link";
import type { DefaultServerCellComponentProps } from "payload";
import type { Foto } from "@/payload-types";
import { thumb } from "./thumb";
import styles from "./admin.module.css";

// Campos de foto que puede tener una fila, en orden de preferencia
const PHOTO_FIELDS = ["images", "cover", "image", "photo", "swatch"] as const;

/**
 * Foto principal y nombre de la fila en una sola celda, con enlace a la ficha:
 * se reconoce la pieza por la foto y se abre tocando cualquiera de los dos.
 */
export async function PreviewCell({ rowData, payload, collectionConfig }: DefaultServerCellComponentProps) {
  let value: unknown = null;
  for (const f of PHOTO_FIELDS) {
    const v = Array.isArray(rowData[f]) ? rowData[f][0] : rowData[f];
    if (v != null) {
      value = v;
      break;
    }
  }
  let photo = value && typeof value === "object" ? (value as Foto) : null;
  if (!photo && (typeof value === "number" || typeof value === "string")) {
    photo = await payload.findByID({ collection: "fotos", id: value, depth: 0, overrideAccess: true }).catch(() => null);
  }

  const hex = typeof rowData.hex === "string" && /^#[0-9a-f]{3,8}$/i.test(rowData.hex) ? rowData.hex : null;
  const titleField = collectionConfig.admin.useAsTitle;
  const title = titleField && rowData[titleField] ? String(rowData[titleField]) : "Sin nombre";

  return (
    <Link href={`/admin/collections/${collectionConfig.slug}/${rowData.id}`} className={styles.cellLink}>
      {photo?.url ? (
        // eslint-disable-next-line @next/next/no-img-element -- miniatura del panel, ya optimizada por /_next/image
        <img className={styles.cellThumb} src={thumb(photo.url, 96)} alt="" width={48} height={48} loading="lazy" />
      ) : (
        <span className={styles.cellThumb} style={hex ? { background: hex } : undefined} aria-hidden="true" />
      )}
      <span className={styles.cellTitle}>{title}</span>
    </Link>
  );
}
