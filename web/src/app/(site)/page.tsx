import type { Metadata } from "next";
import { Hub } from "@/components/Hub";
import { JsonLd } from "@/components/JsonLd";
import { brandJsonLd, pageMeta, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Aracena Studio · Arpad Studio · Kormós",
  description: "Arquitectura, mobiliario a medida y visualización arquitectónica en República Dominicana. Diseño que se visualiza, se ejecuta y se materializa.",
  path: "/",
});

export default function Portada() {
  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: "es-DO" },
          brandJsonLd("aracena"),
          brandJsonLd("arpad"),
          brandJsonLd("kormos"),
        ]}
      />
      <Hub />
    </>
  );
}
