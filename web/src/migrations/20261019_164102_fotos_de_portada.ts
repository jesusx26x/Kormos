import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "marcas_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"fotos_id" integer
  );
  
  ALTER TABLE "marcas_rels" ADD CONSTRAINT "marcas_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."marcas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "marcas_rels" ADD CONSTRAINT "marcas_rels_fotos_fk" FOREIGN KEY ("fotos_id") REFERENCES "public"."fotos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "marcas_rels_order_idx" ON "marcas_rels" USING btree ("order");
  CREATE INDEX "marcas_rels_parent_idx" ON "marcas_rels" USING btree ("parent_id");
  CREATE INDEX "marcas_rels_path_idx" ON "marcas_rels" USING btree ("path");
  CREATE INDEX "marcas_rels_fotos_id_idx" ON "marcas_rels" USING btree ("fotos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "marcas_rels" CASCADE;`)
}
