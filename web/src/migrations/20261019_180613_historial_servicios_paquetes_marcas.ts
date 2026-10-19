import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum__paquetes_v_version_price_currency" AS ENUM('RD$', 'US$');
  CREATE TYPE "public"."enum__servicios_v_version_brand" AS ENUM('arpad', 'kormos', 'aracena');
  CREATE TABLE "_paquetes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_price_amount" numeric,
  	"version_price_currency" "enum__paquetes_v_version_price_currency" DEFAULT 'RD$',
  	"version_show_price" boolean DEFAULT false,
  	"version_published" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_paquetes_v_locales" (
  	"version_name" varchar NOT NULL,
  	"version_scale" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_paquetes_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_servicios_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_image_id" integer NOT NULL,
  	"version_brand" "enum__servicios_v_version_brand" DEFAULT 'arpad' NOT NULL,
  	"version_published" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_servicios_v_locales" (
  	"version_title" varchar NOT NULL,
  	"version_summary" varchar NOT NULL,
  	"version_text" varchar NOT NULL,
  	"version_ideal_for" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_servicios_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_marcas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_arpad_instagram" varchar,
  	"version_arpad_email" varchar,
  	"version_kormos_instagram" varchar,
  	"version_kormos_email" varchar,
  	"version_aracena_instagram" varchar,
  	"version_aracena_email" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_marcas_v_locales" (
  	"version_arpad_tagline" varchar,
  	"version_arpad_intro" varchar,
  	"version_kormos_tagline" varchar,
  	"version_kormos_intro" varchar,
  	"version_aracena_tagline" varchar,
  	"version_aracena_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_marcas_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"fotos_id" integer
  );
  
  ALTER TABLE "_paquetes_v" ADD CONSTRAINT "_paquetes_v_parent_id_paquetes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."paquetes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_paquetes_v_locales" ADD CONSTRAINT "_paquetes_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paquetes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paquetes_v_texts" ADD CONSTRAINT "_paquetes_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_paquetes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_servicios_v" ADD CONSTRAINT "_servicios_v_parent_id_servicios_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."servicios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_servicios_v" ADD CONSTRAINT "_servicios_v_version_image_id_fotos_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_servicios_v_locales" ADD CONSTRAINT "_servicios_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_servicios_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_servicios_v_texts" ADD CONSTRAINT "_servicios_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_servicios_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_marcas_v_locales" ADD CONSTRAINT "_marcas_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_marcas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_marcas_v_rels" ADD CONSTRAINT "_marcas_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_marcas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_marcas_v_rels" ADD CONSTRAINT "_marcas_v_rels_fotos_fk" FOREIGN KEY ("fotos_id") REFERENCES "public"."fotos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_paquetes_v_parent_idx" ON "_paquetes_v" USING btree ("parent_id");
  CREATE INDEX "_paquetes_v_version_version__order_idx" ON "_paquetes_v" USING btree ("version__order");
  CREATE INDEX "_paquetes_v_version_version_published_idx" ON "_paquetes_v" USING btree ("version_published");
  CREATE INDEX "_paquetes_v_version_version_updated_at_idx" ON "_paquetes_v" USING btree ("version_updated_at");
  CREATE INDEX "_paquetes_v_version_version_created_at_idx" ON "_paquetes_v" USING btree ("version_created_at");
  CREATE INDEX "_paquetes_v_created_at_idx" ON "_paquetes_v" USING btree ("created_at");
  CREATE INDEX "_paquetes_v_updated_at_idx" ON "_paquetes_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_paquetes_v_locales_locale_parent_id_unique" ON "_paquetes_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_paquetes_v_locales_parent_id_idx" ON "_paquetes_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_paquetes_v_texts_order_parent" ON "_paquetes_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_paquetes_v_texts_locale_parent" ON "_paquetes_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_servicios_v_parent_idx" ON "_servicios_v" USING btree ("parent_id");
  CREATE INDEX "_servicios_v_version_version__order_idx" ON "_servicios_v" USING btree ("version__order");
  CREATE INDEX "_servicios_v_version_version_image_idx" ON "_servicios_v" USING btree ("version_image_id");
  CREATE INDEX "_servicios_v_version_version_brand_idx" ON "_servicios_v" USING btree ("version_brand");
  CREATE INDEX "_servicios_v_version_version_published_idx" ON "_servicios_v" USING btree ("version_published");
  CREATE INDEX "_servicios_v_version_version_updated_at_idx" ON "_servicios_v" USING btree ("version_updated_at");
  CREATE INDEX "_servicios_v_version_version_created_at_idx" ON "_servicios_v" USING btree ("version_created_at");
  CREATE INDEX "_servicios_v_created_at_idx" ON "_servicios_v" USING btree ("created_at");
  CREATE INDEX "_servicios_v_updated_at_idx" ON "_servicios_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_servicios_v_locales_locale_parent_id_unique" ON "_servicios_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_servicios_v_locales_parent_id_idx" ON "_servicios_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_servicios_v_texts_order_parent" ON "_servicios_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_servicios_v_texts_locale_parent" ON "_servicios_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_marcas_v_created_at_idx" ON "_marcas_v" USING btree ("created_at");
  CREATE INDEX "_marcas_v_updated_at_idx" ON "_marcas_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_marcas_v_locales_locale_parent_id_unique" ON "_marcas_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_marcas_v_locales_parent_id_idx" ON "_marcas_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_marcas_v_rels_order_idx" ON "_marcas_v_rels" USING btree ("order");
  CREATE INDEX "_marcas_v_rels_parent_idx" ON "_marcas_v_rels" USING btree ("parent_id");
  CREATE INDEX "_marcas_v_rels_path_idx" ON "_marcas_v_rels" USING btree ("path");
  CREATE INDEX "_marcas_v_rels_fotos_id_idx" ON "_marcas_v_rels" USING btree ("fotos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "_paquetes_v" CASCADE;
  DROP TABLE "_paquetes_v_locales" CASCADE;
  DROP TABLE "_paquetes_v_texts" CASCADE;
  DROP TABLE "_servicios_v" CASCADE;
  DROP TABLE "_servicios_v_locales" CASCADE;
  DROP TABLE "_servicios_v_texts" CASCADE;
  DROP TABLE "_marcas_v" CASCADE;
  DROP TABLE "_marcas_v_locales" CASCADE;
  DROP TABLE "_marcas_v_rels" CASCADE;
  DROP TYPE "public"."enum__paquetes_v_version_price_currency";
  DROP TYPE "public"."enum__servicios_v_version_brand";`)
}
