import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// La base publicada ya puede tener "_objectkey": se creó antes de que las
// columnas de Blob fueran fijas. IF NOT EXISTS la deja igual en ambos casos.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fotos" ADD COLUMN IF NOT EXISTS "prefix" varchar DEFAULT '';
  ALTER TABLE "fotos" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  ALTER TABLE "archivos" ADD COLUMN IF NOT EXISTS "prefix" varchar DEFAULT '';
  ALTER TABLE "archivos" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fotos" DROP COLUMN IF EXISTS "prefix";
  ALTER TABLE "fotos" DROP COLUMN IF EXISTS "_objectkey";
  ALTER TABLE "archivos" DROP COLUMN IF EXISTS "prefix";
  ALTER TABLE "archivos" DROP COLUMN IF EXISTS "_objectkey";`)
}
