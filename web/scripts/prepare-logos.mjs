// Vectoriza los logos raster de las tres marcas (potrace) y genera
// src/lib/logos.generated.ts con { viewBox, d } para usarlos en línea
// (necesario para la animación de trazo → relleno).
//
// Uso: node scripts/prepare-logos.mjs
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import potrace from "potrace";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT_TS = path.resolve(HERE, "..", "src", "lib", "logos.generated.ts");
const OUT_SVG = path.resolve(HERE, "..", "public", "brand");
const ZIP = process.env.KORMOS_ZIP_DIR; // carpeta con el zip de Kormós ya extraído

// mode: "alpha" = logo sobre fondo transparente (se usa el canal alfa)
//       "dark"  = tinta oscura sobre fondo claro (umbral de luminancia)
const LOGOS = [
  { key: "kormosMonogram", file: path.join(ROOT, "LOGO KORMOS", "LOGO KORMÓS_1.png"), mode: "alpha" },
  { key: "kormosVertical", file: path.join(ROOT, "LOGO KORMOS", "LOGO KORMÓS_2.png"), mode: "alpha" },
  ZIP && { key: "kormosWordmark", file: path.join(ZIP, "LOGO KORMÓS COMPLETO.png"), mode: "alpha" },
  { key: "arpadMonogram", file: path.join(ROOT, "Logo ARPAD", "LOGO-ARPAD-STUDIO (1).png"), mode: "dark", scale: 4, threshold: 140 },
  // el lema pequeño del original no se puede vectorizar con calidad: se borra y se compone como texto
  { key: "arpadWordmark", file: path.join(ROOT, "Logo ARPAD", "lOGO arpad 2.png"), mode: "dark", scale: 5, threshold: 150, erase: { left: 180, top: 261, width: 240, height: 26 } },
  // Aracena: mockup con textura de papel → umbral bajo y recorte de la zona del monograma
  { key: "aracenaMonogram", file: path.join(ROOT, "LOGO ARACENA STUDIO", "02.png"), mode: "dark", threshold: 105, crop: { top: 0.06, bottom: 0.745, left: 0.3, right: 0.7 } },
  { key: "aracenaWordmark", file: path.join(ROOT, "LOGO ARACENA STUDIO", "01 (1).png"), mode: "dark", threshold: 105, crop: { top: 0.2, bottom: 0.82, left: 0.08, right: 0.92 } },
].filter(Boolean);

async function toInkBitmap(logo) {
  let img = sharp(logo.file);
  const meta = await img.metadata();
  if (logo.erase) {
    const { left, top, width, height } = logo.erase;
    const patch = await sharp({ create: { width, height, channels: 4, background: "#ffffff" } }).png().toBuffer();
    img = sharp(await img.flatten({ background: "#ffffff" }).composite([{ input: patch, left, top }]).png().toBuffer());
  }
  if (logo.crop) {
    const { top, bottom, left, right } = logo.crop;
    img = img.extract({
      left: Math.round(meta.width * left),
      top: Math.round(meta.height * top),
      width: Math.round(meta.width * (right - left)),
      height: Math.round(meta.height * (bottom - top)),
    });
  }
  let buf;
  if (logo.mode === "alpha") {
    buf = await img.ensureAlpha().extractChannel("alpha").negate().png().toBuffer();
  } else {
    buf = await img.flatten({ background: "#ffffff" }).greyscale().median(3).threshold(logo.threshold ?? 128).png().toBuffer();
  }
  if (logo.scale) {
    const m = await sharp(buf).metadata();
    buf = await sharp(buf).resize(m.width * logo.scale, m.height * logo.scale, { kernel: "lanczos3" }).png().toBuffer();
  }
  // recorta el espacio en blanco, normaliza el lado largo a 1200px
  // (coordenadas compactas y curvas suaves) y deja un margen pequeño
  buf = await sharp(buf).trim({ background: "#ffffff", threshold: 40 }).png().toBuffer();
  const t = await sharp(buf).metadata();
  // solo se reduce: ampliar crea escalones que potrace convierte en nodos de más
  const k = Math.min(1, 1200 / Math.max(t.width, t.height));
  buf = await sharp(buf)
    .resize(Math.round(t.width * k), Math.round(t.height * k), { kernel: "lanczos3" })
    .greyscale()
    .threshold(128)
    .extend({ top: 6, bottom: 6, left: 6, right: 6, background: "#ffffff" })
    .png()
    .toBuffer();
  return buf;
}

// Redondea a enteros (lienzo de 1200 px): a tamaño de pantalla la diferencia es invisible
const compact = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n))));

function trace(buf, opts) {
  return new Promise((resolve, reject) => {
    const p = new potrace.Potrace();
    p.setParameters({ threshold: 128, turdSize: 40, optTolerance: 0.6, alphaMax: 1, ...opts });
    p.loadImage(buf, (err) => {
      if (err) return reject(err);
      resolve({ d: p.getPathTag().match(/ d="([^"]+)"/)[1], svg: p.getSVG() });
    });
  });
}

await fs.mkdir(OUT_SVG, { recursive: true });
const out = {};
for (const logo of LOGOS) {
  const buf = await toInkBitmap(logo);
  const { width, height } = await sharp(buf).metadata();
  const d = compact((await trace(buf, {})).d);
  out[logo.key] = { viewBox: `0 0 ${width} ${height}`, d };
  await fs.writeFile(
    path.join(OUT_SVG, `${logo.key}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path fill="currentColor" fill-rule="evenodd" d="${d}"/></svg>\n`,
  );
  console.log(`${logo.key}: ${width}x${height}, ${d.length} chars`);
}

// Trazados completos: solo para logos animados renderizados en el servidor
await fs.writeFile(
  OUT_TS,
  `// Generado por scripts/prepare-logos.mjs — no editar a mano.\n` +
    `// Solo para componentes de servidor (LogoAnimated): no importar en el cliente.\n` +
    `import "server-only";\n\n` +
    `export const LOGOS = ${JSON.stringify(out, null, 2)} as const;\n`,
);
// Medidas sin trazados: seguras para el cliente (logos por máscara CSS)
const meta = Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.viewBox.split(" ").slice(2).map(Number)]));
await fs.writeFile(
  OUT_TS.replace("logos.generated.ts", "logos.meta.generated.ts"),
  `// Generado por scripts/prepare-logos.mjs — no editar a mano.\n` +
    `export const LOGO_SIZES = ${JSON.stringify(meta)} as const;\n\n` +
    `export type LogoKey = keyof typeof LOGO_SIZES;\n`,
);
console.log("→", OUT_TS);
