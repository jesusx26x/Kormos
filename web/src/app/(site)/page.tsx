import type { Metadata } from "next";
import { Hub } from "@/components/Hub";
import { JsonLd } from "@/components/JsonLd";
import { getBrand } from "@/data/studio";
import { BRAND_ORDER } from "@/lib/brands";
import { brandJsonLd, pageMeta, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Aracena Studio · Arpad Studio · Kormós",
  description: "Arquitectura, mobiliario a medida y visualización arquitectónica en República Dominicana. Diseño que se visualiza, se ejecuta y se materializa.",
  path: "/",
});

export default async function Portada() {
  const brands = await Promise.all(BRAND_ORDER.map((slug) => getBrand(slug)));
  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: "es-DO" },
          ...brands.map(brandJsonLd),
        ]}
      />
      <Hub />
    </>
  );
}
