// Iconos de pestaña y de pantalla de inicio (Next: icon.png / apple-icon.png por segmento)
// - app/: las tres marcas juntas sobre fondo neutro (portada, sin jerarquía)
// - app/<marca>/: monograma en blanco sobre el color de la marca
//
// Uso: node scripts/prepare-icons.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const APP = path.join(ROOT, "src", "app");

const mark = async (name, color, size) => {
  const svg = (await fs.readFile(path.join(ROOT, "public", "brand", `${name}.svg`), "utf8")).replace("currentColor", color);
  return sharp(Buffer.from(svg), { density: 300 }).resize(size, size, { fit: "inside" }).png().toBuffer();
};

async function icon(out, size, bg, marks, radius) {
  const inner = Math.round(size * (marks.length > 1 ? 0.26 : 0.6));
  const gap = Math.round(size * 0.05);
  const bufs = await Promise.all(marks.map((m) => mark(m, "#f7f4ef", inner)));
  const metas = await Promise.all(bufs.map((b) => sharp(b).metadata()));
  const total = metas.reduce((w, m) => w + m.width, 0) + gap * (bufs.length - 1);
  let x = Math.round((size - total) / 2);
  const layers = bufs.map((b, i) => {
    const l = { input: b, left: x, top: Math.round((size - metas[i].height) / 2) };
    x += metas[i].width + gap;
    return l;
  });
  // Esquinas redondeadas solo para icon.png (apple-icon las recorta iOS)
  const mask = radius ? Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`) : null;
  let img = sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite(layers);
  if (mask) img = sharp(await img.png().toBuffer()).composite([{ input: mask, blend: "dest-in" }]);
  await img.png().toFile(out);
}

const SETS = [
  ["", "#17130f", ["aracenaMonogram", "arpadMonogram", "kormosMonogram"]],
  ["arpad", "#062045", ["arpadMonogram"]],
  ["kormos", "#463d34", ["kormosMonogram"]],
  ["aracena", "#3a4a3d", ["aracenaMonogram"]],
];

for (const [dir, bg, marks] of SETS) {
  const base = path.join(APP, dir);
  await icon(path.join(base, "icon.png"), 192, bg, marks, 36);
  await icon(path.join(base, "apple-icon.png"), 180, bg, marks, 0);
  console.log(`${dir || "(raíz)"}: icon.png + apple-icon.png`);
}
await fs.rm(path.join(APP, "favicon.ico"), { force: true });
