import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { CatalogGrid } from "@/components/kormos/CatalogGrid";
import { productCard } from "@/components/kormos/catalogData";
import { ContactBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { getCatalog } from "@/data/catalog";

export const metadata: Metadata = pageMeta({
  title: "Catálogo · Kormós",
  description: "Colección Origen: ottomanes, mesas auxiliares, mesas de noche, mesas de centro, marcos para espejo y cuadros de madera, fabricados bajo pedido.",
  path: "/kormos/catalogo",
  brand: "kormos",
});

export default async function KormosCatalogo() {
  const { products, categories } = await getCatalog();
  return (
    <>
      <PageHeader
        media="kormos-interior-butacas"
        eyebrow="Catálogo · Colección Origen"
        title="Piezas pensadas para perdurar"
        lead="Elige la pieza, el acabado y arma tu selección. Todo se fabrica bajo pedido y se puede personalizar en medidas, maderas y tapizados."
      />
      <section className="section" aria-label="Piezas del catálogo">
        <div className="container">
          <CatalogGrid products={products.map(productCard)} categories={categories.map(({ slug, name }) => ({ slug, name }))} />
        </div>
      </section>
      <ContactBand
        slug="kormos"
        title="¿No encuentras la pieza que imaginas?"
        text="En el Atelier la diseñamos contigo y la fabricamos para tu espacio."
        label="Diseñar a medida"
        message="Quiero diseñar una pieza a medida (Atelier)."
      />
    </>
  );
}
