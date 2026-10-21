import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { AREA_NOTE, AREA_PRICES, PRICE_FAQ, RENDER_PACKAGES, SAMPLE_PACKAGE_NAMES } from "../../scripts/contenido-inicial/packages";

// Catálogo de precios que entregó Aracena Studio: sus cuatro paquetes y los
// precios por área. Solo toca lo que sigue igual a la carga inicial, para no
// pisar algo que ya hayan cambiado en el panel.
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const ctx = () => ({ disableRevalidate: true });

  const { docs } = await payload.find({ collection: "paquetes", sort: "_order", limit: 100, depth: 0, pagination: false });
  const samples = docs.filter((d) => (SAMPLE_PACKAGE_NAMES as readonly string[]).includes(d.name));
  // Con algún paquete propio ya cargado, los de muestra se dejan para que los revisen ellos
  if (samples.length === docs.length) {
    for (const [i, p] of RENDER_PACKAGES.entries()) {
      const data = { ...p, published: true };
      const current = samples[i];
      if (current) await payload.update({ collection: "paquetes", id: current.id, data, depth: 0, context: ctx() });
      else await payload.create({ collection: "paquetes", data, depth: 0, context: ctx() });
    }
    for (const extra of samples.slice(RENDER_PACKAGES.length)) {
      await payload.delete({ collection: "paquetes", id: extra.id, depth: 0, context: ctx() });
    }
  }

  const areas = await payload.findGlobal({ slug: "precios-aracena", depth: 0 });
  if (!areas.exterior?.length && !areas.interior?.length) {
    await payload.updateGlobal({ slug: "precios-aracena", data: { currency: "US$", ...AREA_PRICES, note: AREA_NOTE }, depth: 0, context: ctx() });
  }

  // La respuesta original decía que no hay precios publicados
  const faq = await payload.findGlobal({ slug: "preguntas-aracena", depth: 0 });
  const items = faq.items ?? [];
  const price = items.find((i) => i.question === PRICE_FAQ.q);
  if (price && price.answer === PRICE_FAQ.before) {
    await payload.updateGlobal({
      slug: "preguntas-aracena",
      data: { items: items.map((i) => (i === price ? { ...i, answer: PRICE_FAQ.a } : i)) },
      depth: 0,
      context: ctx(),
    });
  }

  const brands = await payload.findGlobal({ slug: "marcas", depth: 0 });
  if (!brands.aracena?.email) {
    await payload.updateGlobal({ slug: "marcas", data: { aracena: { ...brands.aracena, email: "aracenastudio@gmail.com" } }, depth: 0, context: ctx() });
  }
}

// Son datos que el cliente puede cambiar en el panel: no hay nada que deshacer
export async function down(_args: MigrateDownArgs): Promise<void> {}
