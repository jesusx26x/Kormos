import type { Metadata } from "next";
import { BrandShell } from "@/components/BrandShell";
import { JsonLd } from "@/components/JsonLd";
import { brandJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Arpad Studio · Arquitectura, Diseño y Construcción",
  description: "Estudio de arquitectura en República Dominicana: diseño arquitectónico, interiores, E-Design, remodelación, modelado 3D y construcción.",
};

export default function ArpadLayout({ children }: LayoutProps<"/arpad">) {
  return (
    <BrandShell slug="arpad">
      <JsonLd data={brandJsonLd("arpad")} />
      {children}
    </BrandShell>
  );
}
