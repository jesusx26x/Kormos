import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMeta, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productCard } from "@/components/kormos/catalogData";
import styles from "@/components/kormos/Kormos.module.css";
import { ProductView } from "@/components/kormos/ProductView";
import { Reveal } from "@/components/Reveal";
import { ContactBand } from "@/components/sections/GroupBand";
import { dimensionsLabel, getCatalog, getProduct, priceLabel, STATUS_LABEL } from "@/data/catalog";
import sectionStyles from "@/components/sections/Sections.module.css";
import { CatalogGrid } from "@/components/kormos/CatalogGrid";

// Las fichas se prerenderizan: HTML completo en línea (ver ProjectPage).
// Las piezas que se publiquen después desde el panel se generan en la primera visita.
export const instant = false;

export async function generateStaticParams() {
  return (await getCatalog()).products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kormos/catalogo/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return pageMeta({ title: `${p.name} · Kormós`, description: p.summary, path: `/kormos/catalogo/${p.slug}`, brand: "kormos", image: p.images[0].og ?? undefined });
}

export default function KormosProducto({ params }: PageProps<"/kormos/catalogo/[slug]">) {
  return (
    // data-solid-header: la cabecera es sólida desde el primer pintado (no hay foto oscura arriba)
    <div data-solid-header className={styles.productPage}>
      <Producto params={params} />
    </div>
  );
}

async function Producto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  const { products } = await getCatalog();
  const related = products.filter((x) => x.category.slug === p.category.slug && x.slug !== p.slug).slice(0, 4);

  const availability = { disponible: "InStock", bajo_pedido: "PreOrder", proximamente: "PreOrder", agotado: "OutOfStock" }[p.status];
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.code,
    description: p.description.join(" "),
    image: p.images.map((m) => `${SITE_URL}${m.src}`),
    brand: { "@type": "Brand", name: "Kormós" },
    category: p.category.name,
    material: p.materials.map((m) => `${m.label}: ${m.value}`).join("; "),
    // Solo se declara oferta cuando hay precio público
    ...(p.showPrice && p.price
      ? {
          offers: {
            "@type": "Offer",
            price: p.price.amount,
            priceCurrency: p.price.currency === "US$" ? "USD" : "DOP",
            availability: `https://schema.org/${availability}`,
            url: `${SITE_URL}/kormos/catalogo/${p.slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd
        data={[
          productLd,
          breadcrumbJsonLd([
            { name: "Kormós", path: "/kormos" },
            { name: "Catálogo", path: "/kormos/catalogo" },
            { name: p.name, path: `/kormos/catalogo/${p.slug}` },
          ]),
        ]}
      />
      <div className="container">
        <nav aria-label="Ruta">
          <ol className={styles.crumbs}>
            <li>
              <Link href="/kormos">Kormós</Link>
            </li>
            <li>
              <Link href="/kormos/catalogo">Catálogo</Link>
            </li>
            <li>
              <Link href={`/kormos/catalogo#${p.category.slug}`}>{p.category.name}</Link>
            </li>
            <li aria-current="page">{p.name}</li>
          </ol>
        </nav>

        <ProductView
          slug={p.slug}
          code={p.code}
          name={p.name}
          category={p.category.name}
          summary={p.summary}
          price={priceLabel(p)}
          status={p.status}
          statusLabel={STATUS_LABEL[p.status]}
          images={p.images}
          variantLabel={p.variantLabel}
          variants={p.variants}
          dims={dimensionsLabel(p)}
          dimensionsNote={p.dimensionsNote}
          files={p.files}
        />

        <section className={styles.details} aria-labelledby="sobre-la-pieza">
          <Reveal className={styles.detailsBody}>
            <h2 id="sobre-la-pieza" className="eyebrow">
              Sobre la pieza
            </h2>
            {p.description.map((d) => (
              <p key={d.slice(0, 24)}>{d}</p>
            ))}
          </Reveal>
          <Reveal as="dl" className={styles.materialsTable} delay={80}>
            {p.materials.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
            <div>
              <dt>Colección</dt>
              <dd>{p.collection}</dd>
            </div>
            <div>
              <dt>Código</dt>
              <dd>{p.code}</dd>
            </div>
          </Reveal>
        </section>
      </div>

      {related.length ? (
        <section className="section" aria-labelledby="relacionadas">
          <div className="container">
            <header className={sectionStyles.sectionHead}>
              <p className="eyebrow">{p.category.name}</p>
              <h2 id="relacionadas" className={`display ${sectionStyles.sectionTitle}`}>
                También te puede interesar
              </h2>
            </header>
            <CatalogGrid products={related.map(productCard)} categories={[]} filters={false} />
          </div>
        </section>
      ) : null}

      <ContactBand
        slug="kormos"
        title="¿La quieres a tu medida?"
        text="Cada pieza se puede adaptar en medidas, maderas y tapizados. Escríbenos y la ajustamos a tu espacio."
        label="Personalizar esta pieza"
        message={`Quiero personalizar la pieza ${p.name} (${p.code}).`}
      />
    </>
  );
}
