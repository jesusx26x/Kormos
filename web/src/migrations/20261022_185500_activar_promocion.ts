import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

// Promoción de lanzamiento del reel de Kormós: 15 % para las primeras 10
// personas que confirmen su suscripción. Se apaga o se cambia desde el panel.
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: "promocion",
    data: {
      active: true,
      percent: 15,
      slots: 10,
      terms: "Válido en todas las piezas de Kormós. Se puede sumar a otras ofertas y no vence.",
    },
    depth: 0,
    context: { disableRevalidate: true },
  });
}

// Son datos que el cliente puede cambiar en el panel: no hay nada que deshacer
export async function down(_args: MigrateDownArgs): Promise<void> {}
