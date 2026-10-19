import type { Metadata } from "next";
import { BrandShell } from "@/components/BrandShell";
import { JsonLd } from "@/components/JsonLd";
import { brandJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Aracena Studio · Rendering Projects",
  description: "Estudio de visualización arquitectónica: renders hiperrealistas de interiores y exteriores, recorridos virtuales y material para ventas.",
};

export default function AracenaLayout({ children }: LayoutProps<"/aracena">) {
  return (
    <BrandShell slug="aracena">
      <JsonLd data={brandJsonLd("aracena")} />
      {children}
    </BrandShell>
  );
}
