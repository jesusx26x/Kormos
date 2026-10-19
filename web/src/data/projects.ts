import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { BrandSlug } from "@/lib/brands";
import type { Pic } from "@/lib/pic";
import { cms, paragraphs, pic, pics } from "./payload";

// Proyectos de Arpad y Aracena, leídos del panel (en caché hasta que cambian).

export type Credit = { role: string; name: string; href?: string };
export type BeforeAfter = { before: Pic; after: Pic; label: string };

export type Project = {
  brand: BrandSlug;
  slug: string;
  title: string;
  summary: string;
  description: string[];
  categories: string[];
  location?: string;
  services: string[];
  cover: Pic;
  gallery: Pic[];
  beforeAfter: BeforeAfter[];
  credits: Credit[];
  source?: string;
};

export async function getProjects(brand: BrandSlug): Promise<Project[]> {
  "use cache";
  cacheLife("max");
  cacheTag("proyectos");

  const payload = await cms();
  const { docs } = await payload.find({
    collection: "proyectos",
    where: { and: [{ brand: { equals: brand } }, { published: { equals: true } }] },
    sort: "_order",
    limit: 500,
    depth: 1,
  });

  return docs
    .map((p): Project | null => {
      const cover = pic(p.cover);
      if (!cover) return null;
      const gallery = pics(p.gallery);
      return {
        brand,
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        description: paragraphs(p.description),
        categories: p.categories ?? [],
        location: p.location || undefined,
        services: p.services ?? [],
        cover,
        // Sin galería, la portada hace de galería
        gallery: gallery.length ? gallery : [cover],
        beforeAfter: (p.beforeAfter ?? []).flatMap((ba) => {
          const before = pic(ba.before);
          const after = pic(ba.after);
          return before && after ? [{ before, after, label: ba.label }] : [];
        }),
        credits: (p.credits ?? []).map((c) => ({ role: c.role, name: c.name, href: c.href || undefined })),
        source: p.source || undefined,
      };
    })
    .filter((p): p is Project => p !== null);
}

export async function getProject(brand: BrandSlug, slug: string) {
  const list = await getProjects(brand);
  const index = list.findIndex((p) => p.slug === slug);
  if (index < 0) return null;
  return { project: list[index], next: list.length > 1 ? list[(index + 1) % list.length] : undefined };
}

/** Categorías presentes en el portafolio de una marca (para los filtros). */
export function categoriesOf(projects: Project[]) {
  return [...new Set(projects.flatMap((p) => p.categories))];
}
