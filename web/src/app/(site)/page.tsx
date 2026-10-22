import type { Metadata } from "next";
import { Hub } from "@/components/Hub";
import { JsonLd } from "@/components/JsonLd";
import { getBrand } from "@/data/studio";
import { BRAND_ORDER } from "@/lib/brands";
import { brandJsonLd, groupJsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Arquitectura, renders 3D y muebles a medida en República Dominicana · Arpad, Aracena y Kormós",
  description: "Arquitectura, mobiliario a medida y visualización arquitectónica en República Dominicana. Diseño que se visualiza, se ejecuta y se materializa.",
  path: "/",
});

export default async function Portada() {
  const brands = await Promise.all(BRAND_ORDER.map((slug) => getBrand(slug)));
  return (
    <>
      <JsonLd
        data={[
          ...groupJsonLd(brands),
          ...brands.map(brandJsonLd),
        ]}
      />
      <Hub brands={brands} />
    </>
  );
}
