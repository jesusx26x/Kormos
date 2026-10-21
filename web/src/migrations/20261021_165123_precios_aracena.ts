import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_precios_aracena_currency" AS ENUM('US$', 'RD$');
  CREATE TYPE "public"."enum__precios_aracena_v_version_currency" AS ENUM('US$', 'RD$');
  CREATE TABLE "precios_aracena_exterior" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"price_from" numeric NOT NULL,
  	"price_to" numeric
  );
  
  CREATE TABLE "precios_aracena_exterior_locales" (
  	"area" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "precios_aracena_interior" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"price_from" numeric NOT NULL,
  	"price_to" numeric
  );
  
  CREATE TABLE "precios_aracena_interior_locales" (
  	"area" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "precios_aracena" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"currency" "enum_precios_aracena_currency" DEFAULT 'US$' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "precios_aracena_locales" (
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_precios_aracena_v_version_exterior" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"price_from" numeric NOT NULL,
  	"price_to" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_precios_aracena_v_version_exterior_locales" (
  	"area" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_precios_aracena_v_version_interior" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"price_from" numeric NOT NULL,
  	"price_to" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_precios_aracena_v_version_interior_locales" (
  	"area" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_precios_aracena_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_currency" "enum__precios_aracena_v_version_currency" DEFAULT 'US$' NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_precios_aracena_v_locales" (
  	"version_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "paquetes" ALTER COLUMN "price_currency" SET DEFAULT 'US$';
  ALTER TABLE "_paquetes_v" ALTER COLUMN "version_price_currency" SET DEFAULT 'US$';
  ALTER TABLE "paquetes" ADD COLUMN "price_to" numeric;
  ALTER TABLE "paquetes" ADD COLUMN "recommended" boolean DEFAULT false;
  ALTER TABLE "_paquetes_v" ADD COLUMN "version_price_to" numeric;
  ALTER TABLE "_paquetes_v" ADD COLUMN "version_recommended" boolean DEFAULT false;
  ALTER TABLE "precios_aracena_exterior" ADD CONSTRAINT "precios_aracena_exterior_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."precios_aracena"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "precios_aracena_exterior_locales" ADD CONSTRAINT "precios_aracena_exterior_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."precios_aracena_exterior"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "precios_aracena_interior" ADD CONSTRAINT "precios_aracena_interior_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."precios_aracena"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "precios_aracena_interior_locales" ADD CONSTRAINT "precios_aracena_interior_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."precios_aracena_interior"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "precios_aracena_locales" ADD CONSTRAINT "precios_aracena_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."precios_aracena"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_precios_aracena_v_version_exterior" ADD CONSTRAINT "_precios_aracena_v_version_exterior_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_precios_aracena_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_precios_aracena_v_version_exterior_locales" ADD CONSTRAINT "_precios_aracena_v_version_exterior_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_precios_aracena_v_version_exterior"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_precios_aracena_v_version_interior" ADD CONSTRAINT "_precios_aracena_v_version_interior_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_precios_aracena_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_precios_aracena_v_version_interior_locales" ADD CONSTRAINT "_precios_aracena_v_version_interior_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_precios_aracena_v_version_interior"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_precios_aracena_v_locales" ADD CONSTRAINT "_precios_aracena_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_precios_aracena_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "precios_aracena_exterior_order_idx" ON "precios_aracena_exterior" USING btree ("_order");
  CREATE INDEX "precios_aracena_exterior_parent_id_idx" ON "precios_aracena_exterior" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "precios_aracena_exterior_locales_locale_parent_id_unique" ON "precios_aracena_exterior_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "precios_aracena_exterior_locales_parent_id_idx" ON "precios_aracena_exterior_locales" USING btree ("_parent_id");
  CREATE INDEX "precios_aracena_interior_order_idx" ON "precios_aracena_interior" USING btree ("_order");
  CREATE INDEX "precios_aracena_interior_parent_id_idx" ON "precios_aracena_interior" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "precios_aracena_interior_locales_locale_parent_id_unique" ON "precios_aracena_interior_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "precios_aracena_interior_locales_parent_id_idx" ON "precios_aracena_interior_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "precios_aracena_locales_locale_parent_id_unique" ON "precios_aracena_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "precios_aracena_locales_parent_id_idx" ON "precios_aracena_locales" USING btree ("_parent_id");
  CREATE INDEX "_precios_aracena_v_version_exterior_order_idx" ON "_precios_aracena_v_version_exterior" USING btree ("_order");
  CREATE INDEX "_precios_aracena_v_version_exterior_parent_id_idx" ON "_precios_aracena_v_version_exterior" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_precios_aracena_v_version_exterior_locales_locale_parent_id" ON "_precios_aracena_v_version_exterior_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_precios_aracena_v_version_exterior_locales_parent_id_idx" ON "_precios_aracena_v_version_exterior_locales" USING btree ("_parent_id");
  CREATE INDEX "_precios_aracena_v_version_interior_order_idx" ON "_precios_aracena_v_version_interior" USING btree ("_order");
  CREATE INDEX "_precios_aracena_v_version_interior_parent_id_idx" ON "_precios_aracena_v_version_interior" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_precios_aracena_v_version_interior_locales_locale_parent_id" ON "_precios_aracena_v_version_interior_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_precios_aracena_v_version_interior_locales_parent_id_idx" ON "_precios_aracena_v_version_interior_locales" USING btree ("_parent_id");
  CREATE INDEX "_precios_aracena_v_created_at_idx" ON "_precios_aracena_v" USING btree ("created_at");
  CREATE INDEX "_precios_aracena_v_updated_at_idx" ON "_precios_aracena_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_precios_aracena_v_locales_locale_parent_id_unique" ON "_precios_aracena_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_precios_aracena_v_locales_parent_id_idx" ON "_precios_aracena_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "precios_aracena_exterior" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "precios_aracena_exterior_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "precios_aracena_interior" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "precios_aracena_interior_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "precios_aracena" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "precios_aracena_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_precios_aracena_v_version_exterior" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_precios_aracena_v_version_exterior_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_precios_aracena_v_version_interior" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_precios_aracena_v_version_interior_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_precios_aracena_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_precios_aracena_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "precios_aracena_exterior" CASCADE;
  DROP TABLE "precios_aracena_exterior_locales" CASCADE;
  DROP TABLE "precios_aracena_interior" CASCADE;
  DROP TABLE "precios_aracena_interior_locales" CASCADE;
  DROP TABLE "precios_aracena" CASCADE;
  DROP TABLE "precios_aracena_locales" CASCADE;
  DROP TABLE "_precios_aracena_v_version_exterior" CASCADE;
  DROP TABLE "_precios_aracena_v_version_exterior_locales" CASCADE;
  DROP TABLE "_precios_aracena_v_version_interior" CASCADE;
  DROP TABLE "_precios_aracena_v_version_interior_locales" CASCADE;
  DROP TABLE "_precios_aracena_v" CASCADE;
  DROP TABLE "_precios_aracena_v_locales" CASCADE;
  ALTER TABLE "paquetes" ALTER COLUMN "price_currency" SET DEFAULT 'RD$';
  ALTER TABLE "_paquetes_v" ALTER COLUMN "version_price_currency" SET DEFAULT 'RD$';
  ALTER TABLE "paquetes" DROP COLUMN "price_to";
  ALTER TABLE "paquetes" DROP COLUMN "recommended";
  ALTER TABLE "_paquetes_v" DROP COLUMN "version_price_to";
  ALTER TABLE "_paquetes_v" DROP COLUMN "version_recommended";
  DROP TYPE "public"."enum_precios_aracena_currency";
  DROP TYPE "public"."enum__precios_aracena_v_version_currency";`)
}
