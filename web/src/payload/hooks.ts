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

/** "a, b y c" */
const listJoin = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} y ${items.at(-1)}` : (items[0] ?? ""));

// Todos los sitios donde se elige una foto. Si se añade un campo de foto nuevo, va aquí.
const PHOTO_USES = [
  { collection: "productos", fields: ["images", "variants.images"], title: "name", one: "pieza", many: "piezas" },
  { collection: "proyectos", fields: ["cover", "gallery", "beforeAfter.before", "beforeAfter.after"], title: "title", one: "proyecto", many: "proyectos" },
  { collection: "servicios", fields: ["image"], title: "title", one: "servicio", many: "servicios" },
  { collection: "equipo", fields: ["photo"], title: "name", one: "persona del equipo", many: "personas del equipo" },
  { collection: "acabados", fields: ["swatch"], title: "name", one: "acabado", many: "acabados" },
] as const;
const HERO_BRANDS = { arpad: "Arpad Studio", kormos: "Kormós", aracena: "Aracena Studio" } as const;

/**
 * No deja borrar una foto que todavía se ve en el sitio: la ficha se quedaría
 * con un hueco (o sin la portada obligatoria) sin que nadie lo note.
 */
export const blockDeleteIfPhotoUsed: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const uses: string[] = [];
  for (const use of PHOTO_USES) {
    const { docs, totalDocs } = await req.payload.find({
      collection: use.collection,
      where: { or: use.fields.map((field) => ({ [field]: { equals: id } })) },
      limit: 3,
      depth: 0,
      req,
    });
    for (const doc of docs) uses.push(`${use.one} ${String((doc as unknown as Record<string, unknown>)[use.title] ?? "")}`.trim());
    const rest = totalDocs - docs.length;
    if (rest > 0) uses.push(`${rest} ${rest === 1 ? use.one : use.many} más`);
  }
  const brands = await req.payload.findGlobal({ slug: "marcas", depth: 0, req });
  for (const [brand, name] of Object.entries(HERO_BRANDS)) {
    const photos = brands[brand as keyof typeof HERO_BRANDS]?.heroPhotos ?? [];
    if (photos.some((p) => String(typeof p === "object" ? p.id : p) === String(id))) uses.push(`portada de ${name}`);
  }
  if (!uses.length) return;
  throw new APIError(`No se puede borrar esta foto: la usan ${listJoin(uses)}. Quítala de ahí primero y vuelve a intentarlo.`, 400, null, true);
};

/** Siempre tiene que quedar alguien que pueda entrar al panel. */
export const blockDeleteOwnOrLastUser: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (req.user && String(req.user.id) === String(id)) {
    throw new APIError("No puedes borrar tu propio usuario. Si hace falta, pide a otra persona con acceso al panel que lo haga.", 400, null, true);
  }
  const { totalDocs } = await req.payload.count({ collection: "usuarios", req });
  if (totalDocs <= 1) {
    throw new APIError("No se puede borrar el único usuario del panel: nadie más podría entrar. Crea otro usuario primero.", 400, null, true);
  }
};
