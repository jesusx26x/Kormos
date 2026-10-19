import "server-only";
import { categoriesOf, getProjects } from "@/data/projects";
import type { BrandSlug } from "@/lib/brands";
import type { ProjectCard } from "./ProjectGrid";

/** Tarjetas serializables para <ProjectGrid> (cliente). */
export async function projectCards(brand: BrandSlug): Promise<{ projects: ProjectCard[]; categories: string[] }> {
  const list = await getProjects(brand);
  return {
    categories: categoriesOf(list),
    projects: list.map((p) => ({
      href: `/${brand}/proyectos/${p.slug}`,
      title: p.title,
      summary: p.summary,
      categories: p.categories,
      location: p.location,
      image: { src: p.cover.src, alt: p.cover.alt, blurDataURL: p.cover.blurDataURL },
    })),
  };
}
