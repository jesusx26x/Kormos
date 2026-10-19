import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { RenderPackage } from "@/components/sections/Cards";
import { priceLabel } from "./catalog";
import { cms } from "./payload";

// Paquetes de render y preguntas frecuentes de Aracena, leídos del panel.

export async function getPackages(): Promise<RenderPackage[]> {
  "use cache";
  cacheLife("max");
  cacheTag("paquetes");

  const payload = await cms();
  const { docs } = await payload.find({ collection: "paquetes", where: { published: { equals: true } }, sort: "_order", limit: 100 });
  return docs.map((p) => {
    const price = p.priceAmount != null ? { amount: p.priceAmount, currency: p.priceCurrency ?? "RD$" } : null;
    return {
      name: p.name,
      includes: p.includes ?? [],
      // Con precio visible, el precio sustituye a la nota de cómo se cotiza
      scale: p.showPrice && price ? `Desde ${priceLabel({ showPrice: true, price })}` : p.scale,
    };
  });
}

export async function getFaq(): Promise<{ q: string; a: string }[]> {
  "use cache";
  cacheLife("max");
  cacheTag("paquetes");

  const payload = await cms();
  const faq = await payload.findGlobal({ slug: "preguntas-aracena" });
  return (faq.items ?? []).map((i) => ({ q: i.question, a: i.answer }));
}
