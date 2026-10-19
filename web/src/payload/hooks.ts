import { revalidateTag } from "next/cache";
import { APIError, type CollectionBeforeDeleteHook, type CollectionConfig, type FieldHook, type GlobalConfig } from "payload";

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

/**
 * No deja borrar algo que todavía usan piezas del catálogo: el sitio no se
 * rompe, pero la pieza se quedaría sin categoría o sin ese acabado sin que
 * nadie lo note. El mensaje dice cuáles son para cambiarlas primero.
 */
export const blockDeleteIfUsedByProducts =
  (what: string, field: "category" | "variants.finish"): CollectionBeforeDeleteHook =>
  async ({ id, req }) => {
    const { docs, totalDocs } = await req.payload.find({
      collection: "productos",
      where: { [field]: { equals: id } },
      limit: 5,
      depth: 0,
      req,
    });
    if (!totalDocs) return;
    const names = docs.map((d) => d.name).join(", ") + (totalDocs > docs.length ? "…" : "");
    throw new APIError(
      `No se puede borrar ${what}: está en ${totalDocs === 1 ? "1 pieza" : `${totalDocs} piezas`} (${names}). Cambia esas piezas primero y vuelve a intentarlo.`,
      400,
      null,
      true,
    );
  };
