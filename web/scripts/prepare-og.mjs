// Imágenes para compartir (Open Graph, 1200×630) → public/og/
// - og-portada.jpg: las tres marcas en paneles iguales
// - og-<marca>.jpg: foto del hero + logotipo en blanco
// - p-<clave>.jpg: una por cada foto de Kormós (recortes sobre fondo lino)
// WhatsApp prefiere JPG de menos de ~300 KB: se exporta con mozjpeg.
//
// Uso: node scripts/prepare-og.mjs   (después de prepare-media y prepare-logos)
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.resolve(HERE, "..", "public");
const OUT = path.join(PUB, "og");
const W = 1200;
const H = 630;

const logo = async (name, color, height) => {
  const svg = (await fs.readFile(path.join(PUB, "brand", `${name}.svg`), "utf8")).replace("currentColor", color);
  return sharp(Buffer.from(svg), { density: 300 }).resize({ height }).png().toBuffer();
};

const photo = (rel, width, height) => sharp(path.join(PUB, rel)).resize(width, height, { fit: "cover", position: "attention" }).toBuffer();

// Degradado oscuro en SVG para dar contraste al logotipo
const shade = (width, height, top = 0.25, bottom = 0.72) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c0a08" stop-opacity="${top}"/><stop offset="1" stop-color="#0c0a08" stop-opacity="${bottom}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );

const save = (img, name) => img.jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, name));

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

// ---- Portada: tres paneles iguales (orden alfabético, sin jerarquía) ----
const panels = [
  ["media/aracena/aracena-terraza-mar.jpg", "aracenaMonogram"],
  ["media/arpad/arpad-villa.jpg", "arpadMonogram"],
  ["media/kormos/kormos-interior-butacas.jpg", "kormosMonogram"],
];
const pw = W / 3;
const layers = [];
for (const [i, [rel, mono]] of panels.entries()) {
  layers.push({ input: await photo(rel, pw, H), left: i * pw, top: 0 });
  layers.push({ input: shade(pw, H, 0.35, 0.65), left: i * pw, top: 0 });
  const m = await logo(mono, "#f7f4ef", 150);
  const meta = await sharp(m).metadata();
  layers.push({ input: m, left: Math.round(i * pw + (pw - meta.width) / 2), top: Math.round((H - meta.height) / 2) });
  if (i > 0) layers.push({ input: { create: { width: 1, height: H, channels: 4, background: { r: 247, g: 244, b: 239, alpha: 0.25 } } }, left: i * pw, top: 0 });
}
await save(sharp({ create: { width: W, height: H, channels: 3, background: "#17130f" } }).composite(layers), "og-portada.jpg");

// ---- Una por marca ----
const brands = [
  ["arpad", "media/arpad/arpad-villa.jpg", "arpadMonogram", 190],
  ["kormos", "media/kormos/kormos-interior-butacas.jpg", "kormosWordmark", 130],
  ["aracena", "media/aracena/aracena-terraza-mar.jpg", "aracenaWordmark", 190],
];
for (const [slug, rel, mark, h] of brands) {
  const m = await logo(mark, "#f7f4ef", h);
  const meta = await sharp(m).metadata();
  await save(
    sharp(await photo(rel, W, H)).composite([
      { input: shade(W, H, 0.3, 0.7), left: 0, top: 0 },
      { input: m, left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) },
    ]),
    `og-${slug}.jpg`,
  );
}

// ---- Piezas de Kormós y portadas de proyectos (p-<clave>.jpg) ----
const wordmark = await logo("kormosWordmark", "#463d34", 44);
const wm = await sharp(wordmark).metadata();
let n = 0;
for (const dir of ["kormos", "arpad", "aracena"]) for (const file of await fs.readdir(path.join(PUB, "media", dir))) {
  const key = file.replace(/\.(webp|jpg)$/, "");
  const rel = path.join("media", dir, file);
  let base;
  if (file.endsWith(".webp")) {
    // Recorte centrado sobre el fondo lino de la marca
    const piece = await sharp(path.join(PUB, rel)).resize(520, 470, { fit: "inside" }).toBuffer();
    const pm = await sharp(piece).metadata();
    base = sharp({ create: { width: W, height: H, channels: 3, background: "#ebe5db" } }).composite([
      { input: piece, left: Math.round((W - pm.width) / 2), top: Math.round((H - 60 - pm.height) / 2) },
      { input: wordmark, left: Math.round((W - wm.width) / 2), top: H - wm.height - 36 },
    ]);
  } else {
    base = sharp(await photo(rel, W, H));
  }
  await save(base, `p-${key}.jpg`);
  n++;
}

const files = await fs.readdir(OUT);
const sizes = await Promise.all(files.map(async (f) => (await fs.stat(path.join(OUT, f))).size));
console.log(`${files.length} imágenes OG (${n} de piezas y proyectos), máx. ${Math.round(Math.max(...sizes) / 1024)} KB`);
