import path from "node:path";
import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { BRAND_ORDER, BRANDS } from "../lib/brands";
import { MEDIA } from "../lib/media.generated";

// Pedido del cliente: las fotos de portada que ya
// mostraba el sitio quedan cargadas en el panel para que las reemplacen ahí,
// y el equipo pasa a sus nombres completos. Solo datos; el esquema no cambia.
const TEAM_NAMES = [
  ["Arq. Beamel P.", "Arq. Beamel Padilla"],
  ["Arq. Brayant A.", "Arq. Brayant Aracena"],
] as const;

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Sin `req` y con un contexto nuevo en cada llamada: el plugin de Blob guarda
  // el archivo en el contexto, y uno compartido hacía que solo subiera el primero
  const ctx = () => ({ disableRevalidate: true });

  const global = await payload.findGlobal({ slug: "marcas", depth: 0 });
  const changes: Record<string, unknown> = {};
  for (const slug of BRAND_ORDER) {
    // Si ya eligieron fotos en el panel, no se tocan
    if (global[slug]?.heroPhotos?.length) continue;
    const ids: number[] = [];
    for (const key of BRANDS[slug].heroMedia) {
      const m = MEDIA[key];
      const filename = path.basename(m.src);
      const { docs } = await payload.find({ collection: "fotos", where: { filename: { equals: filename } }, limit: 1, depth: 0 });
      const photo =
        docs[0] ??
        (await payload.create({
          collection: "fotos",
          data: { alt: m.alt || `Foto de ${BRANDS[slug].name}` },
          filePath: path.resolve(process.cwd(), "public", m.src.replace(/^\//, "")),
          context: ctx(),
        }));
      ids.push(photo.id);
    }
    changes[slug] = { ...global[slug], heroPhotos: ids };
  }
  if (Object.keys(changes).length) {
    await payload.updateGlobal({ slug: "marcas", data: changes, depth: 0, context: ctx() });
  }

  for (const [from, to] of TEAM_NAMES) {
    const { docs } = await payload.find({ collection: "equipo", where: { name: { equals: from } }, limit: 10, depth: 0 });
    for (const member of docs) {
      await payload.update({ collection: "equipo", id: member.id, data: { name: to }, depth: 0, context: ctx() });
    }
  }
}

// Son datos que el cliente puede cambiar en el panel: no hay nada que deshacer
export async function down(_args: MigrateDownArgs): Promise<void> {}
