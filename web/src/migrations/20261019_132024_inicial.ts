import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es');
  CREATE TYPE "public"."enum_productos_price_currency" AS ENUM('RD$', 'US$');
  CREATE TYPE "public"."enum_productos_status" AS ENUM('disponible', 'bajo_pedido', 'proximamente', 'agotado');
  CREATE TYPE "public"."enum_acabados_kind" AS ENUM('madera', 'tela', 'color', 'otro');
  CREATE TYPE "public"."enum_proyectos_categories" AS ENUM('Residencial', 'Comercial', 'Remodelación', 'Interiorismo', 'Exterior', 'Interior');
  CREATE TYPE "public"."enum_proyectos_brand" AS ENUM('arpad', 'aracena');
  CREATE TYPE "public"."enum_paquetes_price_currency" AS ENUM('RD$', 'US$');
  CREATE TYPE "public"."enum_servicios_brand" AS ENUM('arpad', 'kormos', 'aracena');
  CREATE TYPE "public"."enum_equipo_brand" AS ENUM('arpad', 'kormos', 'aracena');
  CREATE TYPE "public"."enum_testimonios_brand" AS ENUM('arpad', 'kormos', 'aracena');
  CREATE TYPE "public"."enum_suscriptores_brand" AS ENUM('arpad', 'kormos', 'aracena');
  CREATE TYPE "public"."enum_suscriptores_status" AS ENUM('activo', 'baja');
  CREATE TYPE "public"."enum_archivos_format" AS ENUM('skp', 'dwg', 'pdf');
  CREATE TABLE "productos_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"finish_id" integer NOT NULL
  );
  
  CREATE TABLE "productos_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "productos_materials_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "productos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"code" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"height" numeric,
  	"width" numeric,
  	"depth" numeric,
  	"price_amount" numeric,
  	"price_currency" "enum_productos_price_currency" DEFAULT 'RD$',
  	"show_price" boolean DEFAULT false,
  	"status" "enum_productos_status" DEFAULT 'bajo_pedido' NOT NULL,
  	"file_skp_id" integer,
  	"file_dwg_id" integer,
  	"file_pdf_id" integer,
  	"notified_at" timestamp(3) with time zone,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "productos_locales" (
  	"name" varchar NOT NULL,
  	"collection" varchar DEFAULT 'Colección Origen' NOT NULL,
  	"summary" varchar NOT NULL,
  	"description" varchar,
  	"variant_label" varchar DEFAULT 'Madera',
  	"dimensions_note" varchar DEFAULT 'Medidas estándar. También se fabrica a la medida de tu espacio.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "productos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"fotos_id" integer
  );
  
  CREATE TABLE "categorias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categorias_locales" (
  	"name" varchar NOT NULL,
  	"singular" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "acabados" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"kind" "enum_acabados_kind" DEFAULT 'madera' NOT NULL,
  	"swatch_id" integer,
  	"hex" varchar,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "acabados_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "proyectos_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_proyectos_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "proyectos_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"before_id" integer NOT NULL,
  	"after_id" integer NOT NULL
  );
  
  CREATE TABLE "proyectos_before_after_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_credits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "proyectos_credits_locales" (
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"brand" "enum_proyectos_brand" NOT NULL,
  	"location" varchar,
  	"cover_id" integer NOT NULL,
  	"source" varchar,
  	"notified_at" timestamp(3) with time zone,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "proyectos_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "proyectos_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "proyectos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"fotos_id" integer
  );
  
  CREATE TABLE "paquetes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"price_amount" numeric,
  	"price_currency" "enum_paquetes_price_currency" DEFAULT 'RD$',
  	"show_price" boolean DEFAULT false,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "paquetes_locales" (
  	"name" varchar NOT NULL,
  	"scale" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "paquetes_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "servicios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"image_id" integer NOT NULL,
  	"brand" "enum_servicios_brand" DEFAULT 'arpad' NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "servicios_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"ideal_for" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "servicios_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "equipo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"brand" "enum_equipo_brand" DEFAULT 'arpad' NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "equipo_locales" (
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "testimonios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"author" varchar NOT NULL,
  	"project_id" integer,
  	"brand" "enum_testimonios_brand" DEFAULT 'arpad' NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonios_locales" (
  	"quote" varchar NOT NULL,
  	"detail" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "suscriptores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"brand" "enum_suscriptores_brand",
  	"status" "enum_suscriptores_status" DEFAULT 'activo' NOT NULL,
  	"unsubscribed_at" timestamp(3) with time zone,
  	"token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "fotos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cutout" boolean DEFAULT false,
  	"blur_data_u_r_l" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "fotos_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "archivos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"format" "enum_archivos_format",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "usuarios_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "usuarios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"productos_id" integer,
  	"categorias_id" integer,
  	"acabados_id" integer,
  	"proyectos_id" integer,
  	"paquetes_id" integer,
  	"servicios_id" integer,
  	"equipo_id" integer,
  	"testimonios_id" integer,
  	"suscriptores_id" integer,
  	"fotos_id" integer,
  	"archivos_id" integer,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "preguntas_aracena_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "preguntas_aracena_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "preguntas_aracena" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "proceso_arpad_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "proceso_arpad_steps_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proceso_arpad" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "marcas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"arpad_instagram" varchar,
  	"arpad_email" varchar,
  	"kormos_instagram" varchar,
  	"kormos_email" varchar,
  	"aracena_instagram" varchar,
  	"aracena_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "marcas_locales" (
  	"arpad_tagline" varchar,
  	"arpad_intro" varchar,
  	"kormos_tagline" varchar,
  	"kormos_intro" varchar,
  	"aracena_tagline" varchar,
  	"aracena_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "productos_variants" ADD CONSTRAINT "productos_variants_finish_id_acabados_id_fk" FOREIGN KEY ("finish_id") REFERENCES "public"."acabados"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos_variants" ADD CONSTRAINT "productos_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos_materials" ADD CONSTRAINT "productos_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos_materials_locales" ADD CONSTRAINT "productos_materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."productos_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos" ADD CONSTRAINT "productos_category_id_categorias_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categorias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos" ADD CONSTRAINT "productos_file_skp_id_archivos_id_fk" FOREIGN KEY ("file_skp_id") REFERENCES "public"."archivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos" ADD CONSTRAINT "productos_file_dwg_id_archivos_id_fk" FOREIGN KEY ("file_dwg_id") REFERENCES "public"."archivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos" ADD CONSTRAINT "productos_file_pdf_id_archivos_id_fk" FOREIGN KEY ("file_pdf_id") REFERENCES "public"."archivos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "productos_locales" ADD CONSTRAINT "productos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos_rels" ADD CONSTRAINT "productos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "productos_rels" ADD CONSTRAINT "productos_rels_fotos_fk" FOREIGN KEY ("fotos_id") REFERENCES "public"."fotos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categorias_locales" ADD CONSTRAINT "categorias_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "acabados" ADD CONSTRAINT "acabados_swatch_id_fotos_id_fk" FOREIGN KEY ("swatch_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "acabados_locales" ADD CONSTRAINT "acabados_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."acabados"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_categories" ADD CONSTRAINT "proyectos_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_before_after" ADD CONSTRAINT "proyectos_before_after_before_id_fotos_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos_before_after" ADD CONSTRAINT "proyectos_before_after_after_id_fotos_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos_before_after" ADD CONSTRAINT "proyectos_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_before_after_locales" ADD CONSTRAINT "proyectos_before_after_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_before_after"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_credits" ADD CONSTRAINT "proyectos_credits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_credits_locales" ADD CONSTRAINT "proyectos_credits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_credits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_cover_id_fotos_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos_locales" ADD CONSTRAINT "proyectos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_texts" ADD CONSTRAINT "proyectos_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_rels" ADD CONSTRAINT "proyectos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_rels" ADD CONSTRAINT "proyectos_rels_fotos_fk" FOREIGN KEY ("fotos_id") REFERENCES "public"."fotos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paquetes_locales" ADD CONSTRAINT "paquetes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paquetes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paquetes_texts" ADD CONSTRAINT "paquetes_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."paquetes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicios" ADD CONSTRAINT "servicios_image_id_fotos_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "servicios_locales" ADD CONSTRAINT "servicios_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicios_texts" ADD CONSTRAINT "servicios_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipo" ADD CONSTRAINT "equipo_photo_id_fotos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."fotos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "equipo_locales" ADD CONSTRAINT "equipo_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonios" ADD CONSTRAINT "testimonios_project_id_proyectos_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonios_locales" ADD CONSTRAINT "testimonios_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fotos_locales" ADD CONSTRAINT "fotos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fotos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "usuarios_sessions" ADD CONSTRAINT "usuarios_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_productos_fk" FOREIGN KEY ("productos_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_acabados_fk" FOREIGN KEY ("acabados_id") REFERENCES "public"."acabados"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_proyectos_fk" FOREIGN KEY ("proyectos_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_paquetes_fk" FOREIGN KEY ("paquetes_id") REFERENCES "public"."paquetes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_servicios_fk" FOREIGN KEY ("servicios_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_equipo_fk" FOREIGN KEY ("equipo_id") REFERENCES "public"."equipo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonios_fk" FOREIGN KEY ("testimonios_id") REFERENCES "public"."testimonios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_suscriptores_fk" FOREIGN KEY ("suscriptores_id") REFERENCES "public"."suscriptores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fotos_fk" FOREIGN KEY ("fotos_id") REFERENCES "public"."fotos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_archivos_fk" FOREIGN KEY ("archivos_id") REFERENCES "public"."archivos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "preguntas_aracena_items" ADD CONSTRAINT "preguntas_aracena_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."preguntas_aracena"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "preguntas_aracena_items_locales" ADD CONSTRAINT "preguntas_aracena_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."preguntas_aracena_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proceso_arpad_steps" ADD CONSTRAINT "proceso_arpad_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proceso_arpad"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proceso_arpad_steps_locales" ADD CONSTRAINT "proceso_arpad_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proceso_arpad_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "marcas_locales" ADD CONSTRAINT "marcas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."marcas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "productos_variants_order_idx" ON "productos_variants" USING btree ("_order");
  CREATE INDEX "productos_variants_parent_id_idx" ON "productos_variants" USING btree ("_parent_id");
  CREATE INDEX "productos_variants_finish_idx" ON "productos_variants" USING btree ("finish_id");
  CREATE INDEX "productos_materials_order_idx" ON "productos_materials" USING btree ("_order");
  CREATE INDEX "productos_materials_parent_id_idx" ON "productos_materials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "productos_materials_locales_locale_parent_id_unique" ON "productos_materials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "productos_materials_locales_parent_id_idx" ON "productos_materials_locales" USING btree ("_parent_id");
  CREATE INDEX "productos__order_idx" ON "productos" USING btree ("_order");
  CREATE UNIQUE INDEX "productos_code_idx" ON "productos" USING btree ("code");
  CREATE INDEX "productos_category_idx" ON "productos" USING btree ("category_id");
  CREATE INDEX "productos_file_skp_idx" ON "productos" USING btree ("file_skp_id");
  CREATE INDEX "productos_file_dwg_idx" ON "productos" USING btree ("file_dwg_id");
  CREATE INDEX "productos_file_pdf_idx" ON "productos" USING btree ("file_pdf_id");
  CREATE UNIQUE INDEX "productos_slug_idx" ON "productos" USING btree ("slug");
  CREATE INDEX "productos_published_idx" ON "productos" USING btree ("published");
  CREATE INDEX "productos_updated_at_idx" ON "productos" USING btree ("updated_at");
  CREATE INDEX "productos_created_at_idx" ON "productos" USING btree ("created_at");
  CREATE UNIQUE INDEX "productos_locales_locale_parent_id_unique" ON "productos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "productos_locales_parent_id_idx" ON "productos_locales" USING btree ("_parent_id");
  CREATE INDEX "productos_rels_order_idx" ON "productos_rels" USING btree ("order");
  CREATE INDEX "productos_rels_parent_idx" ON "productos_rels" USING btree ("parent_id");
  CREATE INDEX "productos_rels_path_idx" ON "productos_rels" USING btree ("path");
  CREATE INDEX "productos_rels_fotos_id_idx" ON "productos_rels" USING btree ("fotos_id");
  CREATE INDEX "categorias__order_idx" ON "categorias" USING btree ("_order");
  CREATE UNIQUE INDEX "categorias_slug_idx" ON "categorias" USING btree ("slug");
  CREATE INDEX "categorias_updated_at_idx" ON "categorias" USING btree ("updated_at");
  CREATE INDEX "categorias_created_at_idx" ON "categorias" USING btree ("created_at");
  CREATE UNIQUE INDEX "categorias_locales_locale_parent_id_unique" ON "categorias_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categorias_locales_parent_id_idx" ON "categorias_locales" USING btree ("_parent_id");
  CREATE INDEX "acabados__order_idx" ON "acabados" USING btree ("_order");
  CREATE INDEX "acabados_swatch_idx" ON "acabados" USING btree ("swatch_id");
  CREATE UNIQUE INDEX "acabados_slug_idx" ON "acabados" USING btree ("slug");
  CREATE INDEX "acabados_updated_at_idx" ON "acabados" USING btree ("updated_at");
  CREATE INDEX "acabados_created_at_idx" ON "acabados" USING btree ("created_at");
  CREATE UNIQUE INDEX "acabados_locales_locale_parent_id_unique" ON "acabados_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "acabados_locales_parent_id_idx" ON "acabados_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_categories_order_idx" ON "proyectos_categories" USING btree ("order");
  CREATE INDEX "proyectos_categories_parent_idx" ON "proyectos_categories" USING btree ("parent_id");
  CREATE INDEX "proyectos_before_after_order_idx" ON "proyectos_before_after" USING btree ("_order");
  CREATE INDEX "proyectos_before_after_parent_id_idx" ON "proyectos_before_after" USING btree ("_parent_id");
  CREATE INDEX "proyectos_before_after_before_idx" ON "proyectos_before_after" USING btree ("before_id");
  CREATE INDEX "proyectos_before_after_after_idx" ON "proyectos_before_after" USING btree ("after_id");
  CREATE UNIQUE INDEX "proyectos_before_after_locales_locale_parent_id_unique" ON "proyectos_before_after_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_before_after_locales_parent_id_idx" ON "proyectos_before_after_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_credits_order_idx" ON "proyectos_credits" USING btree ("_order");
  CREATE INDEX "proyectos_credits_parent_id_idx" ON "proyectos_credits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proyectos_credits_locales_locale_parent_id_unique" ON "proyectos_credits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_credits_locales_parent_id_idx" ON "proyectos_credits_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos__order_idx" ON "proyectos" USING btree ("_order");
  CREATE INDEX "proyectos_cover_idx" ON "proyectos" USING btree ("cover_id");
  CREATE UNIQUE INDEX "proyectos_slug_idx" ON "proyectos" USING btree ("slug");
  CREATE INDEX "proyectos_published_idx" ON "proyectos" USING btree ("published");
  CREATE INDEX "proyectos_updated_at_idx" ON "proyectos" USING btree ("updated_at");
  CREATE INDEX "proyectos_created_at_idx" ON "proyectos" USING btree ("created_at");
  CREATE UNIQUE INDEX "proyectos_locales_locale_parent_id_unique" ON "proyectos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_locales_parent_id_idx" ON "proyectos_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_texts_order_parent" ON "proyectos_texts" USING btree ("order","parent_id");
  CREATE INDEX "proyectos_texts_locale_parent" ON "proyectos_texts" USING btree ("locale","parent_id");
  CREATE INDEX "proyectos_rels_order_idx" ON "proyectos_rels" USING btree ("order");
  CREATE INDEX "proyectos_rels_parent_idx" ON "proyectos_rels" USING btree ("parent_id");
  CREATE INDEX "proyectos_rels_path_idx" ON "proyectos_rels" USING btree ("path");
  CREATE INDEX "proyectos_rels_fotos_id_idx" ON "proyectos_rels" USING btree ("fotos_id");
  CREATE INDEX "paquetes__order_idx" ON "paquetes" USING btree ("_order");
  CREATE INDEX "paquetes_published_idx" ON "paquetes" USING btree ("published");
  CREATE INDEX "paquetes_updated_at_idx" ON "paquetes" USING btree ("updated_at");
  CREATE INDEX "paquetes_created_at_idx" ON "paquetes" USING btree ("created_at");
  CREATE UNIQUE INDEX "paquetes_locales_locale_parent_id_unique" ON "paquetes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "paquetes_locales_parent_id_idx" ON "paquetes_locales" USING btree ("_parent_id");
  CREATE INDEX "paquetes_texts_order_parent" ON "paquetes_texts" USING btree ("order","parent_id");
  CREATE INDEX "paquetes_texts_locale_parent" ON "paquetes_texts" USING btree ("locale","parent_id");
  CREATE INDEX "servicios__order_idx" ON "servicios" USING btree ("_order");
  CREATE INDEX "servicios_image_idx" ON "servicios" USING btree ("image_id");
  CREATE INDEX "servicios_brand_idx" ON "servicios" USING btree ("brand");
  CREATE INDEX "servicios_published_idx" ON "servicios" USING btree ("published");
  CREATE INDEX "servicios_updated_at_idx" ON "servicios" USING btree ("updated_at");
  CREATE INDEX "servicios_created_at_idx" ON "servicios" USING btree ("created_at");
  CREATE UNIQUE INDEX "servicios_locales_locale_parent_id_unique" ON "servicios_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "servicios_locales_parent_id_idx" ON "servicios_locales" USING btree ("_parent_id");
  CREATE INDEX "servicios_texts_order_parent" ON "servicios_texts" USING btree ("order","parent_id");
  CREATE INDEX "servicios_texts_locale_parent" ON "servicios_texts" USING btree ("locale","parent_id");
  CREATE INDEX "equipo__order_idx" ON "equipo" USING btree ("_order");
  CREATE INDEX "equipo_photo_idx" ON "equipo" USING btree ("photo_id");
  CREATE INDEX "equipo_brand_idx" ON "equipo" USING btree ("brand");
  CREATE INDEX "equipo_published_idx" ON "equipo" USING btree ("published");
  CREATE INDEX "equipo_updated_at_idx" ON "equipo" USING btree ("updated_at");
  CREATE INDEX "equipo_created_at_idx" ON "equipo" USING btree ("created_at");
  CREATE UNIQUE INDEX "equipo_locales_locale_parent_id_unique" ON "equipo_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "equipo_locales_parent_id_idx" ON "equipo_locales" USING btree ("_parent_id");
  CREATE INDEX "testimonios__order_idx" ON "testimonios" USING btree ("_order");
  CREATE INDEX "testimonios_project_idx" ON "testimonios" USING btree ("project_id");
  CREATE INDEX "testimonios_brand_idx" ON "testimonios" USING btree ("brand");
  CREATE INDEX "testimonios_published_idx" ON "testimonios" USING btree ("published");
  CREATE INDEX "testimonios_updated_at_idx" ON "testimonios" USING btree ("updated_at");
  CREATE INDEX "testimonios_created_at_idx" ON "testimonios" USING btree ("created_at");
  CREATE UNIQUE INDEX "testimonios_locales_locale_parent_id_unique" ON "testimonios_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonios_locales_parent_id_idx" ON "testimonios_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "suscriptores_email_idx" ON "suscriptores" USING btree ("email");
  CREATE INDEX "suscriptores_status_idx" ON "suscriptores" USING btree ("status");
  CREATE UNIQUE INDEX "suscriptores_token_idx" ON "suscriptores" USING btree ("token");
  CREATE INDEX "suscriptores_updated_at_idx" ON "suscriptores" USING btree ("updated_at");
  CREATE INDEX "suscriptores_created_at_idx" ON "suscriptores" USING btree ("created_at");
  CREATE INDEX "fotos_updated_at_idx" ON "fotos" USING btree ("updated_at");
  CREATE INDEX "fotos_created_at_idx" ON "fotos" USING btree ("created_at");
  CREATE UNIQUE INDEX "fotos_filename_idx" ON "fotos" USING btree ("filename");
  CREATE UNIQUE INDEX "fotos_locales_locale_parent_id_unique" ON "fotos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fotos_locales_parent_id_idx" ON "fotos_locales" USING btree ("_parent_id");
  CREATE INDEX "archivos_updated_at_idx" ON "archivos" USING btree ("updated_at");
  CREATE INDEX "archivos_created_at_idx" ON "archivos" USING btree ("created_at");
  CREATE UNIQUE INDEX "archivos_filename_idx" ON "archivos" USING btree ("filename");
  CREATE INDEX "usuarios_sessions_order_idx" ON "usuarios_sessions" USING btree ("_order");
  CREATE INDEX "usuarios_sessions_parent_id_idx" ON "usuarios_sessions" USING btree ("_parent_id");
  CREATE INDEX "usuarios_updated_at_idx" ON "usuarios" USING btree ("updated_at");
  CREATE INDEX "usuarios_created_at_idx" ON "usuarios" USING btree ("created_at");
  CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_productos_id_idx" ON "payload_locked_documents_rels" USING btree ("productos_id");
  CREATE INDEX "payload_locked_documents_rels_categorias_id_idx" ON "payload_locked_documents_rels" USING btree ("categorias_id");
  CREATE INDEX "payload_locked_documents_rels_acabados_id_idx" ON "payload_locked_documents_rels" USING btree ("acabados_id");
  CREATE INDEX "payload_locked_documents_rels_proyectos_id_idx" ON "payload_locked_documents_rels" USING btree ("proyectos_id");
  CREATE INDEX "payload_locked_documents_rels_paquetes_id_idx" ON "payload_locked_documents_rels" USING btree ("paquetes_id");
  CREATE INDEX "payload_locked_documents_rels_servicios_id_idx" ON "payload_locked_documents_rels" USING btree ("servicios_id");
  CREATE INDEX "payload_locked_documents_rels_equipo_id_idx" ON "payload_locked_documents_rels" USING btree ("equipo_id");
  CREATE INDEX "payload_locked_documents_rels_testimonios_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonios_id");
  CREATE INDEX "payload_locked_documents_rels_suscriptores_id_idx" ON "payload_locked_documents_rels" USING btree ("suscriptores_id");
  CREATE INDEX "payload_locked_documents_rels_fotos_id_idx" ON "payload_locked_documents_rels" USING btree ("fotos_id");
  CREATE INDEX "payload_locked_documents_rels_archivos_id_idx" ON "payload_locked_documents_rels" USING btree ("archivos_id");
  CREATE INDEX "payload_locked_documents_rels_usuarios_id_idx" ON "payload_locked_documents_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_usuarios_id_idx" ON "payload_preferences_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "preguntas_aracena_items_order_idx" ON "preguntas_aracena_items" USING btree ("_order");
  CREATE INDEX "preguntas_aracena_items_parent_id_idx" ON "preguntas_aracena_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "preguntas_aracena_items_locales_locale_parent_id_unique" ON "preguntas_aracena_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "preguntas_aracena_items_locales_parent_id_idx" ON "preguntas_aracena_items_locales" USING btree ("_parent_id");
  CREATE INDEX "proceso_arpad_steps_order_idx" ON "proceso_arpad_steps" USING btree ("_order");
  CREATE INDEX "proceso_arpad_steps_parent_id_idx" ON "proceso_arpad_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proceso_arpad_steps_locales_locale_parent_id_unique" ON "proceso_arpad_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proceso_arpad_steps_locales_parent_id_idx" ON "proceso_arpad_steps_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "marcas_locales_locale_parent_id_unique" ON "marcas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "marcas_locales_parent_id_idx" ON "marcas_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "productos_variants" CASCADE;
  DROP TABLE "productos_materials" CASCADE;
  DROP TABLE "productos_materials_locales" CASCADE;
  DROP TABLE "productos" CASCADE;
  DROP TABLE "productos_locales" CASCADE;
  DROP TABLE "productos_rels" CASCADE;
  DROP TABLE "categorias" CASCADE;
  DROP TABLE "categorias_locales" CASCADE;
  DROP TABLE "acabados" CASCADE;
  DROP TABLE "acabados_locales" CASCADE;
  DROP TABLE "proyectos_categories" CASCADE;
  DROP TABLE "proyectos_before_after" CASCADE;
  DROP TABLE "proyectos_before_after_locales" CASCADE;
  DROP TABLE "proyectos_credits" CASCADE;
  DROP TABLE "proyectos_credits_locales" CASCADE;
  DROP TABLE "proyectos" CASCADE;
  DROP TABLE "proyectos_locales" CASCADE;
  DROP TABLE "proyectos_texts" CASCADE;
  DROP TABLE "proyectos_rels" CASCADE;
  DROP TABLE "paquetes" CASCADE;
  DROP TABLE "paquetes_locales" CASCADE;
  DROP TABLE "paquetes_texts" CASCADE;
  DROP TABLE "servicios" CASCADE;
  DROP TABLE "servicios_locales" CASCADE;
  DROP TABLE "servicios_texts" CASCADE;
  DROP TABLE "equipo" CASCADE;
  DROP TABLE "equipo_locales" CASCADE;
  DROP TABLE "testimonios" CASCADE;
  DROP TABLE "testimonios_locales" CASCADE;
  DROP TABLE "suscriptores" CASCADE;
  DROP TABLE "fotos" CASCADE;
  DROP TABLE "fotos_locales" CASCADE;
  DROP TABLE "archivos" CASCADE;
  DROP TABLE "usuarios_sessions" CASCADE;
  DROP TABLE "usuarios" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "preguntas_aracena_items" CASCADE;
  DROP TABLE "preguntas_aracena_items_locales" CASCADE;
  DROP TABLE "preguntas_aracena" CASCADE;
  DROP TABLE "proceso_arpad_steps" CASCADE;
  DROP TABLE "proceso_arpad_steps_locales" CASCADE;
  DROP TABLE "proceso_arpad" CASCADE;
  DROP TABLE "marcas" CASCADE;
  DROP TABLE "marcas_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_productos_price_currency";
  DROP TYPE "public"."enum_productos_status";
  DROP TYPE "public"."enum_acabados_kind";
  DROP TYPE "public"."enum_proyectos_categories";
  DROP TYPE "public"."enum_proyectos_brand";
  DROP TYPE "public"."enum_paquetes_price_currency";
  DROP TYPE "public"."enum_servicios_brand";
  DROP TYPE "public"."enum_equipo_brand";
  DROP TYPE "public"."enum_testimonios_brand";
  DROP TYPE "public"."enum_suscriptores_brand";
  DROP TYPE "public"."enum_suscriptores_status";
  DROP TYPE "public"."enum_archivos_format";`)
}
