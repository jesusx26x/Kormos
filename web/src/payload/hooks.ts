import { revalidateTag } from "next/cache";
import type { CollectionConfig, FieldHook, GlobalConfig } from "payload";

/** "Mesa de Noche Ébano" → "mesa-de-noche-ebano" */
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Si el enlace queda vacío, se genera a partir de otro campo (el nombre o el título). */
export const slugFrom =
  (field: string): FieldHook =>
  ({ value, data }) => {
    const source = typeof value === "string" && value.trim() ? value : data?.[field];
    return typeof source === "string" ? slugify(source) : value;
  };

/**
 * Invalida la caché del sitio cuando el contenido cambia en el panel, para que
 * la página pública muestre el cambio en la siguiente visita. Fuera de Next
 * (p. ej. el script de carga inicial) no hay caché que invalidar.
 */
function revalidate(tags: string[]) {
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // Sin servidor de Next en marcha: nada que invalidar
    }
  }
}

export function revalidateCollection(tags: string[]): CollectionConfig["hooks"] {
  return {
    afterChange: [
      ({ doc, context }) => {
        if (!context.disableRevalidate) revalidate(tags);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc, context }) => {
        if (!context.disableRevalidate) revalidate(tags);
        return doc;
      },
    ],
  };
}

export function revalidateGlobal(tags: string[]): GlobalConfig["hooks"] {
  return {
    afterChange: [
      ({ doc, context }) => {
        if (!context.disableRevalidate) revalidate(tags);
        return doc;
      },
    ],
  };
}
