import type { MetadataRoute } from "next";
import { getCatalog } from "@/data/catalog";
import { getProjects } from "@/data/projects";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/seo";

/** Mapa del sitio: páginas fijas, proyectos y piezas del catálogo. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ products }, arpad, aracena] = await Promise.all([getCatalog(), getProjects("arpad"), getProjects("aracena")]);
  const at = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly", lastModified: string = CONTENT_UPDATED) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    at("/", 1),
    at("/arpad", 0.9),
    at("/arpad/proyectos", 0.8, "weekly"),
    at("/arpad/servicios", 0.8),
    at("/arpad/proceso", 0.6),
    at("/arpad/estudio", 0.6),
    at("/kormos", 0.9),
    at("/kormos/catalogo", 0.9, "weekly"),
    at("/kormos/atelier", 0.7),
    at("/aracena", 0.9),
    at("/aracena/proyectos", 0.8, "weekly"),
    at("/aracena/paquetes", 0.8),
    ...[...arpad, ...aracena].map((p) => at(`/${p.brand}/proyectos/${p.slug}`, 0.6, "monthly", p.updatedAt)),
    ...products.map((p) => at(`/kormos/catalogo/${p.slug}`, 0.7, "monthly", p.updatedAt)),
  ];
}
