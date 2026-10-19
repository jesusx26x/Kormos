import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Pic } from "@/lib/pic";
import type { Acabado, Archivo, Categoria } from "@/payload-types";
import { cms, doc, paragraphs, pic, pics } from "./payload";

// Catálogo de Kormós, leído del panel. Se guarda en caché hasta que alguien
// cambia un producto, acabado, categoría, foto o archivo (ver payload/hooks.ts).

export type ProductStatus = "disponible" | "bajo_pedido" | "proximamente" | "agotado";
export type Currency = "RD$" | "US$";

export const STATUS_LABEL: Record<ProductStatus, string> = {
  disponible: "Disponible",
  bajo_pedido: "Bajo pedido",
  proximamente: "Próximamente",
  agotado: "Agotado",
};

export type Category = { slug: string; name: string; singular: string };

export type Variant = {
  id: string;
  name: string;
  /** Muestra: textura o color plano */
  swatch: { src?: string; hex?: string };
  /** Fotos de la pieza en este acabado (si no hay, se usan las generales) */
  images: Pic[] | null;
};

export type Product = {
  slug: string;
  code: string;
  name: string;
  category: Category;
  collection: string;
  summary: string;
  description: string[];
  materials: { label: string; value: string }[];
  /** Medidas en cm (alto × ancho × profundidad) */
  dimensions: { alto: number; ancho: number; fondo: number } | null;
  dimensionsNote: string;
  price: { amount: number; currency: Currency } | null;
  showPrice: boolean;
  status: ProductStatus;
  images: Pic[];
  variantLabel: string;
  variants: Variant[];
  files: { skp?: string; dwg?: string; pdf?: string };
};

const fileUrl = (value: number | Archivo | null | undefined) => doc(value)?.url ?? undefined;

function category(value: number | Categoria): Category {
  const c = doc(value);
  return c ? { slug: c.slug, name: c.name, singular: c.singular } : { slug: "otros", name: "Otros", singular: "Pieza" };
}

function variant(v: { finish: number | Acabado; images?: unknown }): Variant | null {
  const f = doc(v.finish);
  if (!f) return null;
  const swatch = pic(f.swatch);
  const images = pics(v.images as Parameters<typeof pics>[0]);
  return {
    id: f.slug,
    name: f.name,
    swatch: swatch ? { src: swatch.src } : { hex: f.hex ?? "#c9bfb2" },
    images: images.length ? images : null,
  };
}

export async function getCatalog(): Promise<{ categories: Category[]; products: Product[] }> {
  "use cache";
  cacheLife("max");
  cacheTag("catalogo");

  const payload = await cms();
  const [cats, prods] = await Promise.all([
    payload.find({ collection: "categorias", sort: "_order", limit: 100, depth: 0 }),
    payload.find({ collection: "productos", where: { published: { equals: true } }, sort: "_order", limit: 500, depth: 2 }),
  ]);

  const products = prods.docs
    .map((p): Product | null => {
      const images = pics(p.images);
      // Sin foto no hay tarjeta ni ficha que mostrar
      if (!images.length) return null;
      const hasDims = p.height != null && p.width != null && p.depth != null;
      return {
        slug: p.slug,
        code: p.code,
        name: p.name,
        category: category(p.category),
        collection: p.collection,
        summary: p.summary,
        description: paragraphs(p.description),
        materials: (p.materials ?? []).map(({ label, value }) => ({ label, value })),
        dimensions: hasDims ? { alto: p.height!, ancho: p.width!, fondo: p.depth! } : null,
        dimensionsNote: p.dimensionsNote ?? "",
        price: p.priceAmount != null ? { amount: p.priceAmount, currency: p.priceCurrency ?? "RD$" } : null,
        showPrice: !!p.showPrice,
        status: p.status,
        images,
        variantLabel: p.variantLabel ?? "Acabado",
        variants: (p.variants ?? []).map(variant).filter((v): v is Variant => v !== null),
        files: { skp: fileUrl(p.fileSkp), dwg: fileUrl(p.fileDwg), pdf: fileUrl(p.filePdf) },
      };
    })
    .filter((p): p is Product => p !== null);

  // Solo las categorías con alguna pieza visible aparecen como filtro
  const used = new Set(products.map((p) => p.category.slug));
  const categories = cats.docs.filter((c) => used.has(c.slug)).map((c) => ({ slug: c.slug, name: c.name, singular: c.singular }));

  return { categories, products };
}

export async function getProduct(slug: string) {
  const { products } = await getCatalog();
  return products.find((p) => p.slug === slug) ?? null;
}

/** Precio visible o "Precio a consultar" */
export function priceLabel(p: Pick<Product, "showPrice" | "price">) {
  if (!p.showPrice || !p.price) return "Precio a consultar";
  // Formato fijo (no toLocaleString) para que servidor y navegador coincidan al hidratar
  const amount = String(p.price.amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${p.price.currency} ${amount}`;
}

export function dimensionsLabel(p: Pick<Product, "dimensions">) {
  return p.dimensions ? `${p.dimensions.alto} × ${p.dimensions.ancho} × ${p.dimensions.fondo} cm` : null;
}
