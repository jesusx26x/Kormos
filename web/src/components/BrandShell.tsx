import { BRANDS, otherBrands, type BrandSlug } from "@/lib/brands";
import { cartIndex } from "./kormos/catalogData";
import { CartDrawer } from "./kormos/CartDrawer";
import { ScrollToTop } from "./ScrollToTop";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { WhatsAppFloat } from "./WhatsAppFloat";

/** Estructura común de las tres marcas: el tema lo da data-brand. */
export function BrandShell({ slug, children }: { slug: BrandSlug; children: React.ReactNode }) {
  const brand = BRANDS[slug];
  const others = otherBrands(slug);
  return (
    <div data-brand={slug} className="brand-shell">
      <ScrollToTop />
      <SiteHeader brand={brand} others={others} />
      <main id="contenido">{children}</main>
      <SiteFooter brand={brand} others={others} />
      <WhatsAppFloat brand={slug} />
      {slug === "kormos" ? <KormosCart /> : null}
    </div>
  );
}

/** El cajón de "Mi selección" necesita el índice del catálogo (en caché). */
async function KormosCart() {
  return <CartDrawer products={await cartIndex()} />;
}
