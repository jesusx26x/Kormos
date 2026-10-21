// Pasa el contenido del panel local (SQLite + web/uploads) al sitio publicado
// (PostgreSQL + Vercel Blob), sin volver a subir nada a mano. Dos pasos:
//
//   1) npm run contenido:exportar
//      Con el .env local. Guarda todo en web/exportacion/ (datos + fotos y archivos).
//      npm run contenido:respaldo hace lo mismo desde el sitio publicado
//      (.env.nube): sirve de copia de seguridad.
//
//   2) npm run contenido:importar
//      Lee las variables del sitio publicado de web/.env.nube (DATABASE_URL
//      postgres://… y BLOB_READ_WRITE_TOKEN), en una base recién migrada y vacía. Crea cada
//      ficha y sube cada archivo; las relaciones (fotos de una pieza, acabados,
//      proyecto de un testimonio…) se reconectan con los nuevos números.
//
// No pasa los usuarios del panel: las contraseñas no se pueden copiar. El
// primer usuario se crea en /admin del sitio publicado (ver la guía).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload, type CollectionSlug, type FlattenedField, type GlobalSlug } from "payload";
import configModule from "../src/payload.config";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "..", "exportacion");
const mode = process.argv[2];

// Orden de creación: primero lo que otras fichas usan
const COLLECTIONS = [
  "fotos",
  "archivos",
  "categorias",
  "acabados",
  "productos",
  "proyectos",
  "paquetes",
  "servicios",
  "equipo",
  "testimonios",
  "suscriptores",
] as const satisfies CollectionSlug[];
const GLOBALS = ["precios-aracena", "preguntas-aracena", "proceso-arpad", "marcas"] as const satisfies GlobalSlug[];
const UPLOAD_DIRS: Partial<Record<(typeof COLLECTIONS)[number], string>> = { fotos: "uploads/fotos", archivos: "uploads/archivos" };
// Campos que Payload genera solo
const SYSTEM = new Set(["id", "createdAt", "updatedAt", "_order", "url", "thumbnailURL", "filename", "mimeType", "filesize", "width", "height", "focalX", "focalY", "sizes"]);

type Doc = Record<string, unknown>;
type Export = { collections: Record<string, Doc[]>; globals: Record<string, Doc> };

const config = (configModule as unknown as { default?: typeof configModule }).default ?? configModule;
const payload = await getPayload({ config });
// Un objeto nuevo en cada llamada: el plugin de Blob guarda ahí el archivo que
// está subiendo, y uno compartido hacía que solo se subiera la primera foto
const ctx = () => ({ disableRevalidate: true });

const isCloud = /^postgres/.test(process.env.DATABASE_URI || process.env.DATABASE_URL || "");

if (mode === "exportar") {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, "archivos"), { recursive: true });
  const data: Export = { collections: {}, globals: {} };
  for (const slug of COLLECTIONS) {
    const orderable = Boolean(payload.collections[slug].config.orderable);
    const { docs } = await payload.find({ collection: slug, limit: 0, pagination: false, depth: 0, sort: orderable ? "_order" : "createdAt", overrideAccess: true });
    data.collections[slug] = docs as unknown as Doc[];
    const dir = UPLOAD_DIRS[slug];
    if (dir) {
      fs.mkdirSync(path.join(OUT, "archivos", slug), { recursive: true });
      for (const d of docs as unknown as Doc[]) {
        const target = path.join(OUT, "archivos", slug, String(d.filename));
        const url = typeof d.url === "string" ? d.url : "";
        if (/^https?:\/\//.test(url)) {
          // Sitio publicado: el archivo está en Vercel Blob
          const res = await fetch(url);
          if (!res.ok) throw new Error(`No se pudo descargar ${url} (${slug} #${d.id})`);
          fs.writeFileSync(target, Buffer.from(await res.arrayBuffer()));
        } else {
          const file = path.resolve(HERE, "..", dir, String(d.filename));
          if (!fs.existsSync(file)) throw new Error(`Falta el archivo ${file} (${slug} #${d.id})`);
          fs.copyFileSync(file, target);
        }
      }
    }
    payload.logger.info(`${slug}: ${docs.length}`);
  }
  for (const slug of GLOBALS) data.globals[slug] = (await payload.findGlobal({ slug, depth: 0, overrideAccess: true })) as unknown as Doc;
  fs.writeFileSync(path.join(OUT, "contenido.json"), JSON.stringify(data, null, 2));
  payload.logger.info(isCloud ? `Copia de seguridad lista en ${OUT}.` : `Listo: ${OUT}. Siguiente paso: npm run contenido:importar.`);
} else if (mode === "importar") {
  if (!isCloud) throw new Error("Falta la base del sitio publicado (DATABASE_URL postgres://…) en web/.env.nube.");
  const data = JSON.parse(fs.readFileSync(path.join(OUT, "contenido.json"), "utf8")) as Export;
  const existing = (await payload.count({ collection: "productos", overrideAccess: true })).totalDocs;
  if (existing > 0) throw new Error("La base del sitio publicado ya tiene piezas. Importa solo en una base vacía para no duplicar.");

  const ids = new Map<string, Map<number | string, number | string>>();
  const mapId = (relationTo: string, value: unknown): unknown => {
    if (value == null) return value;
    if (typeof value === "object" && value !== null && "relationTo" in value) {
      const v = value as { relationTo: string; value: unknown };
      return { relationTo: v.relationTo, value: mapId(v.relationTo, v.value) };
    }
    const mapped = ids.get(relationTo)?.get(value as number);
    if (mapped === undefined) throw new Error(`No se encontró ${relationTo} #${String(value)} entre lo ya importado.`);
    return mapped;
  };

  // Recorre los campos y cambia cada referencia por el número nuevo
  const remap = (fields: FlattenedField[], value: Doc): Doc => {
    const out: Doc = {};
    for (const [key, v] of Object.entries(value)) if (!SYSTEM.has(key)) out[key] = v;
    for (const f of fields) {
      const v = out[f.name];
      if (v == null) continue;
      if (f.type === "relationship" || f.type === "upload") {
        const target = Array.isArray(f.relationTo) ? "" : f.relationTo;
        out[f.name] = Array.isArray(v) ? v.map((x) => mapId(target, x)) : mapId(target, v);
      } else if (f.type === "array" && Array.isArray(v)) {
        out[f.name] = v.map((row) => remap(f.flattenedFields, row as Doc));
      } else if ((f.type === "group" || f.type === "tab") && typeof v === "object") {
        out[f.name] = remap(f.flattenedFields, v as Doc);
      } else if (f.type === "blocks" && Array.isArray(v)) {
        out[f.name] = v.map((row) => {
          const block = f.blocks.find((b) => b.slug === (row as Doc).blockType);
          return block ? { ...remap(block.flattenedFields, row as Doc), blockType: block.slug } : row;
        });
      }
    }
    return out;
  };

  for (const slug of COLLECTIONS) {
    const map = new Map<number | string, number | string>();
    ids.set(slug, map);
    const fields = payload.collections[slug].config.flattenedFields;
    for (const d of data.collections[slug] ?? []) {
      const doc = remap(fields, d);
      const dir = UPLOAD_DIRS[slug];
      const created = await payload.create({
        collection: slug,
        data: doc as never,
        filePath: dir ? path.join(OUT, "archivos", slug, String(d.filename)) : undefined,
        overrideAccess: true,
        context: ctx(),
      });
      map.set(d.id as number, created.id);
    }
    payload.logger.info(`${slug}: ${map.size}`);
  }
  for (const slug of GLOBALS) {
    const g = data.globals[slug];
    if (g) await payload.updateGlobal({ slug, data: remap(payload.globals.config.find((c) => c.slug === slug)!.flattenedFields, g) as never, overrideAccess: true, context: ctx() });
  }
  payload.logger.info("Listo. Crea el primer usuario en /admin del sitio publicado y revisa el sitio.");
} else {
  console.log("Uso: npm run contenido:exportar  |  npm run contenido:importar");
}

process.exit(0);
