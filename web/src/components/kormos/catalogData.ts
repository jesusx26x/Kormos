import "server-only";
import { dimensionsLabel, getCatalog, priceLabel, STATUS_LABEL, type Product, type Variant } from "@/data/catalog";
import type { Pic } from "@/lib/pic";

// Datos serializables del catálogo para los componentes de cliente.

export type MediaInfo = Pic;
export type VariantInfo = Variant;

export type ProductCardInfo = {
  slug: string;
  href: string;
  code: string;
  name: string;
  category: string;
  categorySlug: string;
  status: string;
  statusLabel: string;
  price: string;
  image: MediaInfo;
  swatches: { name: string; src?: string; hex?: string }[];
};

export function productCard(p: Product): ProductCardInfo {
  return {
    slug: p.slug,
    href: `/kormos/catalogo/${p.slug}`,
    code: p.code,
    name: p.name,
    category: p.category.name,
    categorySlug: p.category.slug,
    status: p.status,
    statusLabel: STATUS_LABEL[p.status],
    price: priceLabel(p),
    image: p.images[0],
    swatches: p.variants.map((v) => ({ name: v.name, ...v.swatch })),
  };
}

/** Lo mínimo que el cajón del carrito necesita para pintar cada línea y armar el mensaje. */
export type CartProductInfo = {
  slug: string;
  code: string;
  name: string;
  price: string;
  dims: string | null;
  variantLabel: string;
  variants: { id: string; name: string }[];
  image: MediaInfo;
};

export async function cartIndex(): Promise<CartProductInfo[]> {
  const { products } = await getCatalog();
  return products.map((p) => ({
    slug: p.slug,
    code: p.code,
    name: p.name,
    price: priceLabel(p),
    dims: dimensionsLabel(p),
    variantLabel: p.variantLabel,
    variants: p.variants.map((v) => ({ id: v.id, name: v.name })),
    image: p.images[0],
  }));
}
