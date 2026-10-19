// Carga inicial del panel con el contenido que hasta ahora vivía en
// scripts/contenido-inicial/*.ts (catálogo, proyectos, paquetes, preguntas,
// servicios, proceso y equipo), los datos de las marcas y sus fotos.
//
// Uso:   npm run seed            (carga lo que falte; no toca lo que ya hay)
//        npm run seed -- --reset (borra el contenido del panel y lo vuelve a cargar)
//
// También crea un usuario de prueba para el panel local. Sus datos se leen de
// SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD en .env; si faltan, se generan y se
// guardan ahí.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import configModule from "../src/payload.config";
import { CATEGORIES, PRODUCTS, type Variant } from "./contenido-inicial/products";
import { PROJECTS } from "./contenido-inicial/projects";
import { RENDER_FAQ, RENDER_PACKAGES } from "./contenido-inicial/packages";
import { ARPAD_PROCESS, ARPAD_SERVICES, ARPAD_TEAM } from "./contenido-inicial/studio";
import { BRANDS, type BrandSlug } from "../src/lib/brands";
import { MEDIA, type MediaKey } from "../src/lib/media.generated";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(HERE, "..");
const reset = process.argv.includes("--reset");

// payload.config.ts se carga como CommonJS (el paquete no es "type": "module"):
// su export por defecto llega envuelto una vez más
const config = (configModule as unknown as { default?: typeof configModule }).default ?? configModule;
// SQLite no crea la carpeta de la base: en un clon nuevo no existe
fs.mkdirSync(path.join(WEB, "data"), { recursive: true });
const payload = await getPayload({ config });
const ctx = { disableRevalidate: true };

// ---------------------------------------------------------------- qué cargar
// Cada parte se carga solo si está vacía, para poder añadir contenido nuevo
// del panel a una base que ya tiene el catálogo.
const catalogLoaded = (await payload.count({ collection: "productos" })).totalDocs > 0;
const studioLoaded = (await payload.count({ collection: "servicios" })).totalDocs > 0;
if (catalogLoaded && studioLoaded && !reset) {
  payload.logger.info("El panel ya tiene contenido. Usa `npm run seed -- --reset` para borrarlo y cargarlo de nuevo.");
  process.exit(0);
}
if (reset) {
  for (const collection of ["servicios", "equipo", "testimonios", "productos", "proyectos", "paquetes", "acabados", "categorias", "fotos", "archivos"] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, context: ctx });
  }
  payload.logger.info("Contenido anterior borrado.");
}

// ---------------------------------------------------------------- fotos
const photoIds = new Map<MediaKey, number>();
async function photo(key: MediaKey, fallbackAlt: string) {
  const known = photoIds.get(key);
  if (known) return known;
  const m = MEDIA[key];
  if (!m) throw new Error(`Foto no encontrada: ${key}`);
  const doc = await payload.create({
    collection: "fotos",
    data: { alt: m.alt || fallbackAlt },
    filePath: path.join(WEB, "public", m.src),
    context: ctx,
  });
  photoIds.set(key, doc.id);
  return doc.id;
}
const photos = (keys: MediaKey[] | undefined, alt: string) => Promise.all((keys ?? []).map((k) => photo(k, alt)));

if (!catalogLoaded || reset) {
  // ---------------------------------------------------------------- categorías
  const categoryIds = new Map<string, number>();
  for (const c of CATEGORIES) {
    const doc = await payload.create({ collection: "categorias", data: { name: c.name, singular: c.singular, slug: c.slug }, context: ctx });
    categoryIds.set(c.slug, doc.id);
  }

  // ---------------------------------------------------------------- acabados
  const finishIds = new Map<string, number>();
  async function finish(v: Variant, variantLabel: string) {
    const known = finishIds.get(v.id);
    if (known) return known;
    const kind = v.swatch.media?.startsWith("tela-")
      ? "tela"
      : v.swatch.media?.startsWith("mat-")
        ? "madera"
        : variantLabel === "Tapizado"
          ? "tela"
          : "color";
    const doc = await payload.create({
      collection: "acabados",
      data: {
        name: v.name,
        slug: v.id,
        kind,
        hex: v.swatch.hex,
        swatch: v.swatch.media ? await photo(v.swatch.media, `Muestra de ${v.name.toLowerCase()}`) : undefined,
      },
      context: ctx,
    });
    finishIds.set(v.id, doc.id);
    return doc.id;
  }

  // ---------------------------------------------------------------- productos
  for (const p of PRODUCTS) {
    const variants = [];
    for (const v of p.variants) {
      variants.push({
        finish: await finish(v, p.variantLabel),
        images: await photos(v.images, `${p.name} en ${v.name.toLowerCase()}`),
      });
    }
    await payload.create({
      collection: "productos",
      data: {
        name: p.name,
        code: p.code,
        slug: p.slug,
        category: categoryIds.get(p.category)!,
        collection: p.collection,
        summary: p.summary,
        description: p.description.join("\n\n"),
        images: await photos(p.images, p.name),
        variantLabel: p.variantLabel,
        variants,
        height: p.dimensions?.alto,
        width: p.dimensions?.ancho,
        depth: p.dimensions?.fondo,
        dimensionsNote: p.dimensionsNote,
        materials: p.materials,
        priceAmount: p.price?.amount,
        priceCurrency: p.price?.currency ?? "RD$",
        showPrice: p.showPrice,
        status: p.status,
        published: true,
      },
      context: ctx,
    });
  }
  payload.logger.info(`${PRODUCTS.length} productos, ${finishIds.size} acabados, ${CATEGORIES.length} categorías.`);

  // ---------------------------------------------------------------- proyectos
  for (const p of PROJECTS) {
    const beforeAfter = [];
    for (const pair of p.beforeAfter ?? []) {
      beforeAfter.push({
        label: pair.label,
        before: await photo(pair.before, `${p.title}: ${pair.label.toLowerCase()} antes`),
        after: await photo(pair.after, `${p.title}: ${pair.label.toLowerCase()} después`),
      });
    }
    await payload.create({
      collection: "proyectos",
      data: {
        brand: p.brand as "arpad" | "aracena",
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        description: p.description.join("\n\n"),
        categories: p.categories,
        location: p.location,
        services: p.services,
        cover: await photo(p.cover, p.title),
        gallery: await photos(p.gallery, p.title),
        beforeAfter,
        credits: p.credits,
        source: p.source,
        published: true,
      },
      context: ctx,
    });
  }
  payload.logger.info(`${PROJECTS.length} proyectos.`);

  // ---------------------------------------------------------------- paquetes y preguntas
  for (const p of RENDER_PACKAGES) {
    await payload.create({ collection: "paquetes", data: { name: p.name, includes: p.includes, scale: p.scale, published: true }, context: ctx });
  }
  await payload.updateGlobal({
    slug: "preguntas-aracena",
    data: { items: RENDER_FAQ.map((f) => ({ question: f.q, answer: f.a })) },
    context: ctx,
  });
  payload.logger.info(`${RENDER_PACKAGES.length} paquetes, ${RENDER_FAQ.length} preguntas, ${photoIds.size} fotos.`);
}

// ---------------------------------------------------------------- servicios, proceso, equipo y marcas
if (!studioLoaded || reset) {
  for (const s of ARPAD_SERVICES) {
    await payload.create({
      collection: "servicios",
      data: {
        title: s.title,
        summary: s.summary,
        text: s.text,
        includes: s.includes,
        idealFor: s.idealFor,
        image: await photo(s.media, s.title),
        brand: "arpad",
        published: true,
      },
      context: ctx,
    });
  }
  await payload.updateGlobal({ slug: "proceso-arpad", data: { steps: ARPAD_PROCESS }, context: ctx });
  for (const m of ARPAD_TEAM) {
    await payload.create({ collection: "equipo", data: { ...m, brand: "arpad", published: true }, context: ctx });
  }
  const brandInfo = (slug: BrandSlug) => {
    const b = BRANDS[slug];
    return { tagline: b.tagline, intro: b.intro, instagram: b.instagram, email: b.email ?? null };
  };
  await payload.updateGlobal({
    slug: "marcas",
    data: { arpad: brandInfo("arpad"), kormos: brandInfo("kormos"), aracena: brandInfo("aracena") },
    context: ctx,
  });
  payload.logger.info(`${ARPAD_SERVICES.length} servicios, ${ARPAD_PROCESS.length} pasos del proceso, ${ARPAD_TEAM.length} personas del equipo y datos de las marcas.`);
}

// ---------------------------------------------------------------- usuario de prueba
const users = await payload.count({ collection: "usuarios" });
if (users.totalDocs === 0) {
  let email = process.env.SEED_ADMIN_EMAIL;
  let password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    email = "admin@sitio.test";
    password = crypto.randomBytes(12).toString("base64url");
    fs.appendFileSync(
      path.join(WEB, ".env"),
      `\n# Usuario de prueba del panel local (creado por npm run seed)\nSEED_ADMIN_EMAIL=${email}\nSEED_ADMIN_PASSWORD=${password}\n`,
    );
  }
  await payload.create({ collection: "usuarios", data: { email, password, name: "Administración" } });
  payload.logger.info("Usuario de prueba creado (datos en web/.env).");
}

process.exit(0);
