// Copia y optimiza las fotos de muestra (referencias-instagram) a public/media
// y genera src/lib/media.generated.ts con tamaño y placeholder borroso.
// Son imágenes PROVISIONALES: se reemplazan por los originales en alta.
//
// Uso: node scripts/prepare-media.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REF = path.resolve(HERE, "..", "..", "referencias-instagram");
const OUT_DIR = path.resolve(HERE, "..", "public", "media");
const OUT_TS = path.resolve(HERE, "..", "src", "lib", "media.generated.ts");

// clave → [marca, archivo de origen relativo a referencias-instagram, descripción]
const MEDIA = {
  // Kormós
  "kormos-interior-butacas": ["kormos", "kormos/catalogo-canva/5b9b784e0f7f1fbf628bcbe3f7ec9c4c.jpg", "Sala con butacas de madera y mesa auxiliar"],
  "kormos-comedor": ["kormos", "kormos/catalogo-canva/0425a59db077398a62f3f6f799fbe20b.png", "Comedor en tonos oscuros con sillas tapizadas"],
  "kormos-dormitorio": ["kormos", "kormos/catalogo-canva/b178d8314ea2b220549a55d4d9663023.png", "Mesa de noche junto a cabecero tapizado"],
  "kormos-aparador": ["kormos", "kormos/catalogo-canva/ad7bf0e750eb62bac171872a6a6b183b.png", "Aparador de madera oscura"],
  "kormos-sofa-auxiliar": ["kormos", "kormos/catalogo-canva/b840c0247ea1794667170b364a3bcf2f.png", "Mesa auxiliar junto a sofá"],
  "kormos-bano": ["kormos", "kormos/01_DdxCygSGofp_1.jpg", "Mueble de baño estriado y espejo orgánico"],
  "kormos-lavado": ["kormos", "kormos/06_DdUBTJwEXuA_1.jpg", "Mueble de lavado en verde olivo"],
  "kormos-taller-espejo": ["kormos", "kormos/04_Ddb-lJ_Efib_1.jpg", "Proceso en taller: trazado de un espejo"],
  "kormos-taller-mueble": ["kormos", "kormos/04_Ddb-lJ_Efib_3.jpg", "Proceso en taller: estructura de un mueble"],
  "kormos-bench": ["kormos", "kormos/08_DdT-zT8RWlg_1.jpg", "Bench tapizado en verde con base de madera"],
  "kormos-mesa-comedor": ["kormos", "kormos/10_DdHdVQqKd7q_1.jpg", "Mesa de comedor con base estriada"],
  "kormos-bench-moca": ["kormos", "kormos/07_DdT_yFxRp-h_1.jpg", "Bench tapizado en tono moca con base de madera"],
  "kormos-bano-detalle": ["kormos", "kormos/01_DdxCygSGofp_2.jpg", "Mueble de baño estriado con espejo orgánico"],
  // Arpad Studio
  "arpad-villa": ["arpad", "arpad/08_DPUN7fMCZ3k_1.jpg", "Villa contemporánea con fachada en madera"],
  "arpad-hall": ["arpad", "arpad/02_DcyvemlSoKv_1.jpg", "Hall de entrada con credenza y panelados"],
  "arpad-piscina": ["arpad", "arpad/07_DQEcMU7EctA_1.jpg", "Área social con piscina y vegetación tropical"],
  "arpad-piscina-2": ["arpad", "arpad/07_DQEcMU7EctA_2.jpg", "Terraza con comedor exterior junto a la piscina"],
  "arpad-fachada-noche": ["arpad", "arpad/06_DUlMNNQkTdS_1.jpg", "Fachada remodelada con iluminación nocturna"],
  "arpad-fachada-despues": ["arpad", "arpad/10_C_s7ZzypeRH_1.jpg", "Fachada contemporánea: después"],
  "arpad-fachada-antes": ["arpad", "arpad/10_C_s7ZzypeRH_2.jpg", "Fachada tradicional: antes"],
  "arpad-villa-2": ["arpad", "arpad/09_DPPerkHj7PQ_1.jpg", "Villa con terraza y vistas abiertas"],
  "arpad-tienda": ["arpad", "arpad/11_C_lU384pv2W_1.jpg", "Tienda diseñada con E-Design"],
  "arpad-moodboard": ["arpad", "arpad/03_DctZweCgcnV_1.jpg", "Moodboard de materiales: madera, piedra y dorado"],
  "arpad-fachada-noche-antes": ["arpad", "arpad/06_DUlMNNQkTdS_2.jpg", "Fachada original antes de la remodelación"],
  "arpad-garaje-despues": ["arpad", "arpad/10_C_s7ZzypeRH_3.jpg", "Marquesina y garaje: propuesta contemporánea"],
  "arpad-garaje-antes": ["arpad", "arpad/10_C_s7ZzypeRH_4.jpg", "Marquesina y garaje: estado original"],
  "arpad-tienda-2": ["arpad", "arpad/11_C_lU384pv2W_2.jpg", "Tienda: zona de exhibición"],
  "arpad-tienda-3": ["arpad", "arpad/11_C_lU384pv2W_3.jpg", "Tienda: vista general"],
  "arpad-tienda-4": ["arpad", "arpad/12_C_lN-7OSyTy_1.jpg", "Tienda: banco central con jardinera"],
  "arpad-servicios": ["arpad", "arpad/01_DSH68oxkQqt_1.jpg", "Servicios de Arpad Studio"],
  "arpad-cocinas": ["arpad", "arpad/04_DUoMXJkCXIm_1.jpg", "Estilos de cocinas en tendencia"],
  "arpad-material-1": ["arpad", "arpad/04_DUoMXJkCXIm_2.jpg", "Madera oscura, travertino y bronce quemado"],
  "arpad-material-2": ["arpad", "arpad/04_DUoMXJkCXIm_4.jpg", "Nogal, verde profundo y piedra clara"],
  "arpad-material-3": ["arpad", "arpad/04_DUoMXJkCXIm_6.jpg", "Madera natural, piedra clara y metal oscuro"],
  // Aracena Studio
  "aracena-terraza-mar": ["aracena", "aracena/06_DU22odIlsi-_1.jpg", "Terraza frente al mar en Las Terrenas, Samaná"],
  "aracena-living": ["aracena", "aracena/07_DOyVKEOEUL6_1.jpg", "Living con techo de madera y piso geométrico"],
  "aracena-habitacion": ["aracena", "aracena/03_Dc_tNQUSWMQ_1.jpg", "Habitación principal en tonos cálidos"],
  "aracena-bano": ["aracena", "aracena/02_DdBpKyQSvov_1.jpg", "Baño en mármol y madera"],
  "aracena-living-2": ["aracena", "aracena/08_DO6KdvsEYjq_1.jpg", "Living en Punta Cana"],
  "aracena-habitacion-2": ["aracena", "aracena/09_DLID175xaML_1.jpg", "Habitación de inspiración caribeña"],
  "aracena-jardin": ["aracena", "aracena/11_DNk7nB8tgh1_1.jpg", "Jardín interior bajo mezzanine"],
  "aracena-proceso": ["aracena", "aracena/01_DTn7hlAFmRx_1.jpg", "Así se construyen nuestros renders"],
  "aracena-fachada": ["aracena", "aracena/12_DKqVOPvMrXr_1.jpg", "Fachada residencial con escalera exterior"],
  "aracena-proceso-idea": ["aracena", "aracena/01_DTn7hlAFmRx_3.jpg", "Todo inicia con una idea"],
  "aracena-proceso-precios": ["aracena", "aracena/01_DTn7hlAFmRx_4.jpg", "Precios pensados para cada caso"],
  "aracena-proceso-solicitud": ["aracena", "aracena/01_DTn7hlAFmRx_5.jpg", "Cada solicitud merece atención real"],
  "aracena-proceso-anticipo": ["aracena", "aracena/01_DTn7hlAFmRx_6.jpg", "Empezar bien es parte del proceso"],
};

// Recortes de producto con fondo transparente (catálogo Canva de Kormós) → webp con alfa
const CUTOUTS = {
  "kormos-pieza-ottoman": ["kormos", "kormos/catalogo-canva/640b7c7130f0453a151a97327b330415.png", "Ottoman tapizado con banda de madera"],
  "kormos-pieza-auxiliar": ["kormos", "kormos/catalogo-canva/801f54f8cca12eaa0c8a90a656a6c482.png", "Mesa auxiliar en madera maciza"],
  "kormos-pieza-noche": ["kormos", "kormos/catalogo-canva/32ec217ea8799eee900e4624d26bd9fd.png", "Mesa de noche de dos gavetas"],
  "kormos-pieza-centro": ["kormos", "kormos/catalogo-canva/15062d6dcf381ef102d1ec331cfe106a.png", "Mesas de centro a dos alturas"],
  "kormos-pieza-espejo": ["kormos", "kormos/catalogo-canva/0d69b745e77849bf77c6f60a2e487511.png", "Marco de espejo orgánico en madera"],
  "kormos-pieza-cuadro": ["kormos", "kormos/catalogo-canva/6d8f7f1c0432563985896361e2d3a841.png", "Cuadro de madera con relieve geométrico"],
  // Colección Origen: una foto por pieza (mapeadas con las páginas del catálogo Canva)
  "kormos-ottoman-trama": ["kormos", "kormos/catalogo-canva/62765ffd84467e2deb4668bdf26a0fb0.png", "Ottoman Trama: tapizado gris con tapa de madera"],
  "kormos-ottoman-nordico": ["kormos", "kormos/catalogo-canva/0ad7acc60290e29fb0ea8481bcfcd455.png", "Ottoman Nórdico: respaldo envolvente y asiento tapizado"],
  "kormos-ottoman-arlo": ["kormos", "kormos/catalogo-canva/efdc8fde165b71a398e0550dd31ba1a7.png", "Ottoman Arlo: bouclé sobre base de madera en cruz"],
  "kormos-ottoman-nodo": ["kormos", "kormos/catalogo-canva/df74f039dd839b810d24b09b601e0ccd.png", "Ottoman Nodo: bouclé blanco con patas de madera"],
  "kormos-aux-01": ["kormos", "kormos/catalogo-canva/d67e9ad7d25daa7f232e2e9520114409.png", "Mesa auxiliar torneada en madera"],
  "kormos-aux-03": ["kormos", "kormos/catalogo-canva/e1ce3d6f441efc99e2b00a4c7ea56b91.png", "Mesa auxiliar de tapa orgánica"],
  "kormos-aux-04": ["kormos", "kormos/catalogo-canva/baa2e00b6f70f865de3e2ba528b79dfb.png", "Mesa auxiliar de pie central"],
  "kormos-noche-aura": ["kormos", "kormos/catalogo-canva/8c5f0533de3552489c65e1487dd13310.png", "Mesa de noche Aura en madera"],
  "kormos-noche-alma": ["kormos", "kormos/catalogo-canva/b6a438e199ec0c5bf6aa81166e6dc84b.png", "Mesa de noche Alma en tono arena"],
  "kormos-noche-lena": ["kormos", "kormos/catalogo-canva/2b97e01191694377bcd1b5ff85888aa2.png", "Mesa de noche Lena con frente acanalado"],
  "kormos-centro-organica": ["kormos", "kormos/catalogo-canva/c1413e1561e11d44759338779f4ec58c.png", "Mesa de centro de formas orgánicas"],
  "kormos-centro-baja": ["kormos", "kormos/catalogo-canva/ce3daf93413784bbed1c0af12ea9e1ae.png", "Mesa de centro baja en madera clara"],
  "kormos-espejo-arco": ["kormos", "kormos/catalogo-canva/3bda8b3d3972475b10604d7ba5cded94.png", "Marco de espejo en arco con molduras"],
  "kormos-espejo-curvo": ["kormos", "kormos/catalogo-canva/e7a9dbeb4d97a055275ed6555d897383.png", "Marco de espejo de esquinas curvas"],
  "kormos-espejo-cordon": ["kormos", "kormos/catalogo-canva/b065d059c3d55666ad28e308f2f4dd25.png", "Marco de espejo con cordón tallado"],
  "kormos-cuadro-relieve": ["kormos", "kormos/catalogo-canva/7063bebcc8df3a3657ae4aa0e74fae76.png", "Cuadro de madera con relieve en tono tierra"],
  "kormos-cuadro-salvia": ["kormos", "kormos/catalogo-canva/bcbde7b89a09f63a2da1b0986f179768.png", "Cuadro de madera con relieve en verde salvia"],
};

// Muestras de material (texturas del catálogo Canva): asignación aproximada, confirmar con Kormós
const SWATCHES = {
  "mat-nogal": "kormos/catalogo-canva/f712ce686820ebd8a76032b2e70d6ff2.png",
  "mat-roble": "kormos/catalogo-canva/cacbc48ea61f18197e4f4b67e20460ec.png",
  "mat-roble-brasileno": "kormos/catalogo-canva/5ca7b53d6a04e9a365c73555a511c259.png",
  "mat-caoba": "kormos/catalogo-canva/92e860e740bac7443f95fae86294619f.png",
  "mat-cedro": "kormos/catalogo-canva/5dffc8b3b1bb9bc6c980590fbb28b030.png",
  "mat-teka": "kormos/catalogo-canva/63cd03345d5ac56706277ebf2698653e.png",
  "mat-pino": "kormos/catalogo-canva/577a405f3cd24eef4261ac79cc2e6b02.png",
  "mat-jequitiba": "kormos/catalogo-canva/921aecea567eaab2f934ad02037bb025.png",
  "mat-wengue": "kormos/catalogo-canva/e9aab33b1ecc791f00a5a4249fe9e1af.png",
  "tela-lino": "kormos/catalogo-canva/814e3434fa7e63aefc06d9bf9d0e5b21.jpg",
  "tela-crema": "kormos/catalogo-canva/6a760c20a7c66d9f5025cffe3916becf.jpg",
  "tela-boucle-gris": "kormos/catalogo-canva/8a89d6b44746808ee889bfd25893576b.jpg",
  "tela-olivo": "kormos/catalogo-canva/4ba9339dc629fa54e1d2ad639d7f7ff2.png",
};

await fs.rm(OUT_DIR, { recursive: true, force: true });
const manifest = {};
await fs.mkdir(path.join(OUT_DIR, "materiales"), { recursive: true });
for (const [key, rel] of Object.entries(SWATCHES)) {
  const out = path.join(OUT_DIR, "materiales", `${key}.jpg`);
  await sharp(path.join(REF, rel)).flatten({ background: "#ffffff" }).resize(240, 240, { fit: "cover" }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  manifest[key] = { src: `/media/materiales/${key}.jpg`, width: 240, height: 240, alt: "", blurDataURL: null };
}
for (const [key, [brand, rel, alt]] of Object.entries(CUTOUTS)) {
  const dir = path.join(OUT_DIR, brand);
  await fs.mkdir(dir, { recursive: true });
  const img = sharp(path.join(REF, rel)).ensureAlpha().trim({ threshold: 5 });
  const out = path.join(dir, `${key}.webp`);
  const info = await img.clone().resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true }).webp({ quality: 85, alphaQuality: 90 }).toFile(out);
  manifest[key] = { src: `/media/${brand}/${key}.webp`, width: info.width, height: info.height, alt, blurDataURL: null };
  console.log(`${key}: ${info.width}x${info.height} (recorte)`);
}
for (const [key, [brand, rel, alt]] of Object.entries(MEDIA)) {
  const dir = path.join(OUT_DIR, brand);
  await fs.mkdir(dir, { recursive: true });
  const src = path.join(REF, rel);
  const img = sharp(src).rotate().flatten({ background: "#ffffff" });
  const out = path.join(dir, `${key}.jpg`);
  const info = await img.clone().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  const blur = await img.clone().resize(16, 16, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer();
  manifest[key] = {
    src: `/media/${brand}/${key}.jpg`,
    width: info.width,
    height: info.height,
    alt,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
  console.log(`${key}: ${info.width}x${info.height}`);
}

await fs.writeFile(
  OUT_TS,
  `// Generado por scripts/prepare-media.mjs — no editar a mano.\n` +
    `// Fotos PROVISIONALES tomadas de Instagram y del catálogo Canva.\n` +
    `export const MEDIA = ${JSON.stringify(manifest, null, 2)} as const;\n\n` +
    `export type MediaKey = keyof typeof MEDIA;\n`,
);
console.log("→", OUT_TS);
