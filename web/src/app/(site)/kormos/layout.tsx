import type { Metadata } from "next";
import { BrandShell } from "@/components/BrandShell";
import { JsonLd } from "@/components/JsonLd";
import { brandJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kormós · Furniture Design",
  description: "Atelier de ebanistería contemporánea en República Dominicana: mobiliario a medida donde la madera, el diseño y la arquitectura se encuentran.",
};

export default function KormosLayout({ children }: LayoutProps<"/kormos">) {
  return (
    <BrandShell slug="kormos">
      <JsonLd data={brandJsonLd("kormos")} />
      {children}
    </BrandShell>
  );
}
