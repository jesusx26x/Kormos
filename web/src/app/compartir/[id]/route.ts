import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import sharp, { type Sharp } from "sharp";
import { cms } from "@/data/payload";

// Imagen para compartir (Open Graph, 1200×630 JPG) de una foto del panel.
// Mismo diseño que scripts/prepare-og.mjs: las fotos se recortan a 1200×630 y
// las piezas recortadas se centran sobre el fondo lino con el logotipo.
// WhatsApp prefiere JPG de menos de ~300 KB.

const W = 1200;
const H = 630;

async function ogImage(id: number): Promise<Uint8Array | null> {
  "use cache";
  cacheLife("max");
  cacheTag("fotos");

  const payload = await cms();
  const foto = await payload.findByID({ collection: "fotos", id, depth: 0, disableErrors: true });
  if (!foto?.filename) return null;
  const file = path.join(process.cwd(), "uploads", "fotos", foto.filename);

  let image: Sharp;
  if (foto.cutout) {
    const svg = (await fs.readFile(path.join(process.cwd(), "public", "brand", "kormosWordmark.svg"), "utf8")).replace("currentColor", "#463d34");
    const wordmark = await sharp(Buffer.from(svg), { density: 300 }).resize({ height: 44 }).png().toBuffer();
    const wm = await sharp(wordmark).metadata();
    const piece = await sharp(file).resize(520, 470, { fit: "inside" }).toBuffer();
    const pm = await sharp(piece).metadata();
    image = sharp({ create: { width: W, height: H, channels: 3, background: "#ebe5db" } }).composite([
      { input: piece, left: Math.round((W - pm.width) / 2), top: Math.round((H - 60 - pm.height) / 2) },
      { input: wordmark, left: Math.round((W - wm.width) / 2), top: H - wm.height - 36 },
    ]);
  } else {
    image = sharp(file).resize(W, H, { fit: "cover", position: "attention" });
  }
  return new Uint8Array(await image.jpeg({ quality: 80, mozjpeg: true }).toBuffer());
}

export async function GET(_req: Request, { params }: RouteContext<"/compartir/[id]">) {
  const id = Number((await params).id);
  const jpg = Number.isInteger(id) && id > 0 ? await ogImage(id).catch(() => null) : null;
  if (!jpg) return new Response("Imagen no encontrada", { status: 404 });
  return new Response(jpg as BodyInit, {
    headers: {
      "Content-Type": "image/jpeg",
      // La URL lleva la versión de la foto (?v=): se puede guardar mucho tiempo
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
