import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

// Los metrajes del catálogo dejaban fuera los proyectos de 150 a 300 m² y no
// decían desde dónde empieza el paquete Personalizado. Solo se cambia el texto
// que sigue igual a la carga del catálogo, para no pisar un cambio del panel.
const CHANGES = [
  { name: "Premium", from: "Proyectos de 300 a 400 m²", to: "Proyectos de 150 a 400 m²" },
  { name: "Personalizado", from: "Metraje a la medida del proyecto", to: "Más de 400 m² o a la medida" },
];

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  for (const c of CHANGES) {
    const { docs } = await payload.find({
      collection: "paquetes",
      where: { and: [{ name: { equals: c.name } }, { scale: { equals: c.from } }] },
      limit: 10,
      depth: 0,
    });
    for (const doc of docs) {
      await payload.update({ collection: "paquetes", id: doc.id, data: { scale: c.to }, depth: 0, context: { disableRevalidate: true } });
    }
  }
}

// Son datos que el cliente puede cambiar en el panel: no hay nada que deshacer
export async function down(_args: MigrateDownArgs): Promise<void> {}
