import type { Metadata } from "next";
import { BrandShell } from "@/components/BrandShell";
import { JsonLd } from "@/components/JsonLd";
import { getBrand } from "@/data/studio";
import { brandJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Arpad Studio · Arquitectura, Diseño y Construcción",
  description: "Estudio de arquitectura en República Dominicana: diseño arquitectónico, interiores, E-Design, remodelación, modelado 3D y construcción.",
};

export default async function ArpadLayout({ children }: LayoutProps<"/arpad">) {
  return (
    <BrandShell slug="arpad">
      <JsonLd data={brandJsonLd(await getBrand("arpad"))} />
      {children}
    </BrandShell>
  );
}
