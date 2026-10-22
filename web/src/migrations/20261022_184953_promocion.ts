import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "promocion" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"active" boolean DEFAULT false,
  	"percent" numeric DEFAULT 15 NOT NULL,
  	"slots" numeric DEFAULT 10 NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "promocion_locales" (
  	"terms" varchar DEFAULT 'Válido en todas las piezas de Kormós. Se puede sumar a otras ofertas y no vence.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_promocion_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_active" boolean DEFAULT false,
  	"version_percent" numeric DEFAULT 15 NOT NULL,
  	"version_slots" numeric DEFAULT 10 NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_promocion_v_locales" (
  	"version_terms" varchar DEFAULT 'Válido en todas las piezas de Kormós. Se puede sumar a otras ofertas y no vence.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "suscriptores" ADD COLUMN "coupon_number" numeric;
  ALTER TABLE "suscriptores" ADD COLUMN "coupon_code" varchar;
  ALTER TABLE "suscriptores" ADD COLUMN "coupon_sent_at" timestamp(3) with time zone;
  ALTER TABLE "promocion_locales" ADD CONSTRAINT "promocion_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."promocion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_promocion_v_locales" ADD CONSTRAINT "_promocion_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_promocion_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "promocion_locales_locale_parent_id_unique" ON "promocion_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "promocion_locales_parent_id_idx" ON "promocion_locales" USING btree ("_parent_id");
  CREATE INDEX "_promocion_v_created_at_idx" ON "_promocion_v" USING btree ("created_at");
  CREATE INDEX "_promocion_v_updated_at_idx" ON "_promocion_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_promocion_v_locales_locale_parent_id_unique" ON "_promocion_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_promocion_v_locales_parent_id_idx" ON "_promocion_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "suscriptores_coupon_number_idx" ON "suscriptores" USING btree ("coupon_number");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "promocion" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "promocion_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_promocion_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_promocion_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "promocion" CASCADE;
  DROP TABLE "promocion_locales" CASCADE;
  DROP TABLE "_promocion_v" CASCADE;
  DROP TABLE "_promocion_v_locales" CASCADE;
  DROP INDEX "suscriptores_coupon_number_idx";
  ALTER TABLE "suscriptores" DROP COLUMN "coupon_number";
  ALTER TABLE "suscriptores" DROP COLUMN "coupon_code";
  ALTER TABLE "suscriptores" DROP COLUMN "coupon_sent_at";`)
}
