import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum__productos_v_version_price_currency" AS ENUM('RD$', 'US$');
  CREATE TYPE "public"."enum__productos_v_version_status" AS ENUM('disponible', 'bajo_pedido', 'proximamente', 'agotado');
  CREATE TYPE "public"."enum__proyectos_v_version_categories" AS ENUM('Residencial', 'Comercial', 'Remodelación', 'Interiorismo', 'Exterior', 'Interior');
  CREATE TYPE "public"."enum__proyectos_v_version_brand" AS ENUM('arpad', 'aracena');
  CREATE TABLE "_productos_v_version_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"finish_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_productos_v_version_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_productos_v_version_materials_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_productos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_code" varchar NOT NULL,
  	"version_category_id" integer NOT NULL,
  	"version_height" numeric,
  	"version_width" numeric,
  	"version_depth" numeric,
  	"version_price_amount" numeric,
  	"version_price_currency" "enum__productos_v_version_price_currency" DEFAULT 'RD$',
  	"version_show_price" boolean DEFAULT false,
  	"version_status" "enum__productos_v_version_status" DEFAULT 'bajo_pedido' NOT NULL,
  	"version_file_skp_id" integer,
  	"version_file_dwg_id" integer,
  	"version_file_pdf_id" integer,
  	"version_notified_at" timestamp(3) with time zone,
  	"version_slug" varchar NOT NULL,
  	"version_published" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_productos_v_locales" (
  	"version_name" varchar NOT NULL,
  	"version_collection" varchar DEFAULT 'Colección Origen' NOT NULL,
  	"version_summary" varchar NOT NULL,
  	"version_description" varchar,
  	"version_variant_label" varchar DEFAULT 'Madera',
  	"version_dimensions_note" varchar DEFAULT 'Medidas estándar. También se fabrica a la medida de tu espacio.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_productos_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"fotos_id" integer
  );
  
  CREATE TABLE "_proyectos_v_version_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__proyectos_v_version_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_proyectos_v_version_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"before_id" integer NOT NULL,
  	"after_id" integer NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_proyectos_v_version_before_after_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_proyectos_v_version_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_proyectos_v_version_credits_locales" (
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_proyectos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_brand" "enum__proyectos_v_version_brand" NOT NULL,
  	"version_location" varchar,
  	"version_cover_id" integer NOT NULL,
  	"version_source" varchar,
  	"version_notified_at" timestamp(3) with time zone,
  	"version_slug" varchar NOT NULL,
  	"version_published" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_proyectos_v_locales" (
  	"version_title" varchar NOT NULL,
  	"version_summary" varchar NOT NULL,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_proyectos_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_proyectos_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"fotos_id" integer
  );
  
  ALTER TABLE "fotos_locales" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "_productos_v_version_variants" ADD CONSTRAINT "_productos_v_version_variants_finish_id_acabados_id_fk" FOREIGN KEY ("finish_id") REFERENCES "public"."acabados"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v_version_variants" ADD CONSTRAINT "_productos_v_version_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_productos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v_version_materials" ADD CONSTRAINT "_productos_v_version_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_productos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v_version_materials_locales" ADD CONSTRAINT "_productos_v_version_materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_productos_v_version_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v" ADD CONSTRAINT "_productos_v_parent_id_productos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."productos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v" ADD CONSTRAINT "_productos_v_version_category_id_categorias_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categorias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v" ADD CONSTRAINT "_productos_v_version_file_skp_id_archivos_id_fk" FOREIGN KEY ("version_file_skp_id") REFERENCES "public"."archivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v" ADD CONSTRAINT "_productos_v_version_file_dwg_id_archivos_id_fk" FOREIGN KEY ("version_file_dwg_id") REFERENCES "public"."archivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v" ADD CONSTRAINT "_productos_v_version_file_pdf_id_archivos_id_fk" FOREIGN KEY ("version_file_pdf_id") REFERENCES "public"."archivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_productos_v_locales" ADD CONSTRAINT "_productos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_productos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v_rels" ADD CONSTRAINT "_productos_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_productos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_productos_v_rels" ADD CONSTRAINT "_productos_v_rels_fotos_fk" FOREIGN KEY ("fotos_id") REFERENCES "public"."fotos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_categories" ADD CONSTRAINT "_proyectos_v_version_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_before_after" ADD CONSTRAINT "_proyectos_v_version_before_after_before_id_fotos_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_before_after" ADD CONSTRAINT "_proyectos_v_version_before_after_after_id_fotos_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_before_after" ADD CONSTRAINT "_proyectos_v_version_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_before_after_locales" ADD CONSTRAINT "_proyectos_v_version_before_after_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proyectos_v_version_before_after"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_credits" ADD CONSTRAINT "_proyectos_v_version_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_credits_locales" ADD CONSTRAINT "_proyectos_v_version_credits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proyectos_v_version_credits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_parent_id_proyectos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_version_cover_id_fotos_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v_locales" ADD CONSTRAINT "_proyectos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_texts" ADD CONSTRAINT "_proyectos_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_rels" ADD CONSTRAINT "_proyectos_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_rels" ADD CONSTRAINT "_proyectos_v_rels_fotos_fk" FOREIGN KEY ("fotos_id") REFERENCES "public"."fotos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_productos_v_version_variants_order_idx" ON "_productos_v_version_variants" USING btree ("_order");
  CREATE INDEX "_productos_v_version_variants_parent_id_idx" ON "_productos_v_version_variants" USING btree ("_parent_id");
  CREATE INDEX "_productos_v_version_variants_finish_idx" ON "_productos_v_version_variants" USING btree ("finish_id");
  CREATE INDEX "_productos_v_version_materials_order_idx" ON "_productos_v_version_materials" USING btree ("_order");
  CREATE INDEX "_productos_v_version_materials_parent_id_idx" ON "_productos_v_version_materials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_productos_v_version_materials_locales_locale_parent_id_uniq" ON "_productos_v_version_materials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_productos_v_version_materials_locales_parent_id_idx" ON "_productos_v_version_materials_locales" USING btree ("_parent_id");
  CREATE INDEX "_productos_v_parent_idx" ON "_productos_v" USING btree ("parent_id");
  CREATE INDEX "_productos_v_version_version__order_idx" ON "_productos_v" USING btree ("version__order");
  CREATE INDEX "_productos_v_version_version_code_idx" ON "_productos_v" USING btree ("version_code");
  CREATE INDEX "_productos_v_version_version_category_idx" ON "_productos_v" USING btree ("version_category_id");
  CREATE INDEX "_productos_v_version_version_file_skp_idx" ON "_productos_v" USING btree ("version_file_skp_id");
  CREATE INDEX "_productos_v_version_version_file_dwg_idx" ON "_productos_v" USING btree ("version_file_dwg_id");
  CREATE INDEX "_productos_v_version_version_file_pdf_idx" ON "_productos_v" USING btree ("version_file_pdf_id");
  CREATE INDEX "_productos_v_version_version_slug_idx" ON "_productos_v" USING btree ("version_slug");
  CREATE INDEX "_productos_v_version_version_published_idx" ON "_productos_v" USING btree ("version_published");
  CREATE INDEX "_productos_v_version_version_updated_at_idx" ON "_productos_v" USING btree ("version_updated_at");
  CREATE INDEX "_productos_v_version_version_created_at_idx" ON "_productos_v" USING btree ("version_created_at");
  CREATE INDEX "_productos_v_created_at_idx" ON "_productos_v" USING btree ("created_at");
  CREATE INDEX "_productos_v_updated_at_idx" ON "_productos_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_productos_v_locales_locale_parent_id_unique" ON "_productos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_productos_v_locales_parent_id_idx" ON "_productos_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_productos_v_rels_order_idx" ON "_productos_v_rels" USING btree ("order");
  CREATE INDEX "_productos_v_rels_parent_idx" ON "_productos_v_rels" USING btree ("parent_id");
  CREATE INDEX "_productos_v_rels_path_idx" ON "_productos_v_rels" USING btree ("path");
  CREATE INDEX "_productos_v_rels_fotos_id_idx" ON "_productos_v_rels" USING btree ("fotos_id");
  CREATE INDEX "_proyectos_v_version_categories_order_idx" ON "_proyectos_v_version_categories" USING btree ("order");
  CREATE INDEX "_proyectos_v_version_categories_parent_idx" ON "_proyectos_v_version_categories" USING btree ("parent_id");
  CREATE INDEX "_proyectos_v_version_before_after_order_idx" ON "_proyectos_v_version_before_after" USING btree ("_order");
  CREATE INDEX "_proyectos_v_version_before_after_parent_id_idx" ON "_proyectos_v_version_before_after" USING btree ("_parent_id");
  CREATE INDEX "_proyectos_v_version_before_after_before_idx" ON "_proyectos_v_version_before_after" USING btree ("before_id");
  CREATE INDEX "_proyectos_v_version_before_after_after_idx" ON "_proyectos_v_version_before_after" USING btree ("after_id");
  CREATE UNIQUE INDEX "_proyectos_v_version_before_after_locales_locale_parent_id_u" ON "_proyectos_v_version_before_after_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_proyectos_v_version_before_after_locales_parent_id_idx" ON "_proyectos_v_version_before_after_locales" USING btree ("_parent_id");
  CREATE INDEX "_proyectos_v_version_credits_order_idx" ON "_proyectos_v_version_credits" USING btree ("_order");
  CREATE INDEX "_proyectos_v_version_credits_parent_id_idx" ON "_proyectos_v_version_credits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_proyectos_v_version_credits_locales_locale_parent_id_unique" ON "_proyectos_v_version_credits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_proyectos_v_version_credits_locales_parent_id_idx" ON "_proyectos_v_version_credits_locales" USING btree ("_parent_id");
  CREATE INDEX "_proyectos_v_parent_idx" ON "_proyectos_v" USING btree ("parent_id");
  CREATE INDEX "_proyectos_v_version_version__order_idx" ON "_proyectos_v" USING btree ("version__order");
  CREATE INDEX "_proyectos_v_version_version_cover_idx" ON "_proyectos_v" USING btree ("version_cover_id");
  CREATE INDEX "_proyectos_v_version_version_slug_idx" ON "_proyectos_v" USING btree ("version_slug");
  CREATE INDEX "_proyectos_v_version_version_published_idx" ON "_proyectos_v" USING btree ("version_published");
  CREATE INDEX "_proyectos_v_version_version_updated_at_idx" ON "_proyectos_v" USING btree ("version_updated_at");
  CREATE INDEX "_proyectos_v_version_version_created_at_idx" ON "_proyectos_v" USING btree ("version_created_at");
  CREATE INDEX "_proyectos_v_created_at_idx" ON "_proyectos_v" USING btree ("created_at");
  CREATE INDEX "_proyectos_v_updated_at_idx" ON "_proyectos_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_proyectos_v_locales_locale_parent_id_unique" ON "_proyectos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_proyectos_v_locales_parent_id_idx" ON "_proyectos_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_proyectos_v_texts_order_parent" ON "_proyectos_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_proyectos_v_texts_locale_parent" ON "_proyectos_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_proyectos_v_rels_order_idx" ON "_proyectos_v_rels" USING btree ("order");
  CREATE INDEX "_proyectos_v_rels_parent_idx" ON "_proyectos_v_rels" USING btree ("parent_id");
  CREATE INDEX "_proyectos_v_rels_path_idx" ON "_proyectos_v_rels" USING btree ("path");
  CREATE INDEX "_proyectos_v_rels_fotos_id_idx" ON "_proyectos_v_rels" USING btree ("fotos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_productos_v_version_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_productos_v_version_materials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_productos_v_version_materials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_productos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_productos_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_productos_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_version_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_version_before_after" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_version_before_after_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_version_credits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_version_credits_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_productos_v_version_variants" CASCADE;
  DROP TABLE "_productos_v_version_materials" CASCADE;
  DROP TABLE "_productos_v_version_materials_locales" CASCADE;
  DROP TABLE "_productos_v" CASCADE;
  DROP TABLE "_productos_v_locales" CASCADE;
  DROP TABLE "_productos_v_rels" CASCADE;
  DROP TABLE "_proyectos_v_version_categories" CASCADE;
  DROP TABLE "_proyectos_v_version_before_after" CASCADE;
  DROP TABLE "_proyectos_v_version_before_after_locales" CASCADE;
  DROP TABLE "_proyectos_v_version_credits" CASCADE;
  DROP TABLE "_proyectos_v_version_credits_locales" CASCADE;
  DROP TABLE "_proyectos_v" CASCADE;
  DROP TABLE "_proyectos_v_locales" CASCADE;
  DROP TABLE "_proyectos_v_texts" CASCADE;
  DROP TABLE "_proyectos_v_rels" CASCADE;
  ALTER TABLE "fotos_locales" ALTER COLUMN "alt" SET NOT NULL;
  DROP TYPE "public"."enum__productos_v_version_price_currency";
  DROP TYPE "public"."enum__productos_v_version_status";
  DROP TYPE "public"."enum__proyectos_v_version_categories";
  DROP TYPE "public"."enum__proyectos_v_version_brand";`)
}
