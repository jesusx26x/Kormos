import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Where } from "payload";
import type { NumberedItem } from "@/components/sections/Section";
import type { Service } from "@/components/sections/ServicePanel";
import { BRANDS, type Brand, type BrandSlug } from "@/lib/brands";
import type { Pic } from "@/lib/pic";
import { cms, doc, pic } from "./payload";

// Servicios, proceso, equipo, testimonios y datos de marca, leídos del panel.

export type ServiceItem = Service & { summary: string };
export type TeamMember = { name: string; role: string; photo: Pic | null };
export type Testimonial = { quote: string; author: string; detail: string | null; href: string | null };

const onlyPublished = (brand: BrandSlug): Where => ({ and: [{ brand: { equals: brand } }, { published: { equals: true } }] });

export async function getServices(brand: BrandSlug): Promise<ServiceItem[]> {
  "use cache";
  cacheLife("max");
  cacheTag("servicios");

  const payload = await cms();
  const { docs } = await payload.find({ collection: "servicios", where: onlyPublished(brand), sort: "_order", limit: 100, depth: 1 });
  return docs
    .map((s): ServiceItem | null => {
      const image = pic(s.image);
      if (!image) return null;
      return { title: s.title, summary: s.summary, text: s.text, includes: s.includes ?? [], idealFor: s.idealFor ?? null, image };
    })
    .filter((s): s is ServiceItem => s !== null);
}

export async function getArpadProcess(): Promise<NumberedItem[]> {
  "use cache";
  cacheLife("max");
  cacheTag("proceso");

  const payload = await cms();
  const process = await payload.findGlobal({ slug: "proceso-arpad" });
  return (process.steps ?? []).map((s) => ({ title: s.title, text: s.text }));
}

export async function getTeam(brand: BrandSlug): Promise<TeamMember[]> {
  "use cache";
  cacheLife("max");
  cacheTag("equipo");

  const payload = await cms();
  const { docs } = await payload.find({ collection: "equipo", where: onlyPublished(brand), sort: "_order", limit: 100, depth: 1 });
  return docs.map((m) => ({ name: m.name, role: m.role, photo: pic(m.photo) }));
}

export async function getTestimonials(brand: BrandSlug): Promise<Testimonial[]> {
  "use cache";
  cacheLife("max");
  cacheTag("testimonios");
  // El enlace al proyecto depende de su enlace y de si sigue visible
  cacheTag("proyectos");

  const payload = await cms();
  const { docs } = await payload.find({ collection: "testimonios", where: onlyPublished(brand), sort: "_order", limit: 100, depth: 1 });
  return docs.map((t) => {
    const project = doc(t.project);
    return {
      quote: t.quote,
      author: t.author,
      detail: t.detail ?? null,
      href: project?.published ? `/${project.brand}/proyectos/${project.slug}` : null,
    };
  });
}

/**
 * Datos de la marca con los textos del panel. Mientras el panel no se haya
 * guardado nunca, se usan los textos de partida; después, la frase, la
 * presentación y el Instagram vacíos siguen usándolos porque el sitio los
 * necesita, pero un correo vacío se oculta.
 */
export async function getBrand(slug: BrandSlug): Promise<Brand> {
  "use cache";
  cacheLife("max");
  cacheTag("marcas");

  const payload = await cms();
  const global = await payload.findGlobal({ slug: "marcas" });
  const info = global[slug];
  const base = BRANDS[slug];
  return {
    ...base,
    tagline: info?.tagline?.trim() || base.tagline,
    intro: info?.intro?.trim() || base.intro,
    instagram: info?.instagram?.trim().replace(/^@/, "") || base.instagram,
    email: global.updatedAt ? info?.email?.trim() || undefined : base.email,
  };
}
