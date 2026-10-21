import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { RenderPackage } from "@/components/sections/Cards";
import { priceRange } from "./catalog";
import { cms } from "./payload";

// Paquetes de render y preguntas frecuentes de Aracena, leídos del panel.

export async function getPackages(): Promise<RenderPackage[]> {
  "use cache";
  cacheLife("max");
  cacheTag("paquetes");

  const payload = await cms();
  const { docs } = await payload.find({ collection: "paquetes", where: { published: { equals: true } }, sort: "_order", limit: 100 });
  return docs.map((p) => ({
    name: p.name,
    includes: p.includes ?? [],
    scale: p.scale,
    price: p.showPrice && p.priceAmount != null ? priceRange(p.priceCurrency ?? "US$", p.priceAmount, p.priceTo) : null,
    recommended: Boolean(p.recommended),
  }));
}

export type AreaPrices = {
  exterior: { area: string; price: string }[];
  interior: { area: string; price: string }[];
  note: string | null;
};

export async function getAreaPrices(): Promise<AreaPrices> {
  "use cache";
  cacheLife("max");
  cacheTag("paquetes");

  const payload = await cms();
  const g = await payload.findGlobal({ slug: "precios-aracena" });
  const currency = g.currency ?? "US$";
  const list = (rows: typeof g.exterior) => (rows ?? []).map((r) => ({ area: r.area, price: priceRange(currency, r.priceFrom, r.priceTo) }));
  return { exterior: list(g.exterior), interior: list(g.interior), note: g.note?.trim() || null };
}

export async function getFaq(): Promise<{ q: string; a: string }[]> {
  "use cache";
  cacheLife("max");
  cacheTag("paquetes");

  const payload = await cms();
  const faq = await payload.findGlobal({ slug: "preguntas-aracena" });
  return (faq.items ?? []).map((i) => ({ q: i.question, a: i.answer }));
}
