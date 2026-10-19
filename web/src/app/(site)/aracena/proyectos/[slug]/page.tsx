import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { ProjectPage } from "@/components/projects/ProjectPage";
import { getProject, getProjects } from "@/data/projects";

// Los proyectos se prerenderizan: se permite que la navegación espere a la
// página completa (HTML en línea, sin contenido oculto tras un armazón).
// Los que se publiquen después desde el panel se generan en la primera visita.
export const instant = false;

export async function generateStaticParams() {
  return (await getProjects("aracena")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/aracena/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await getProject("aracena", slug);
  if (!found) return {};
  const { project } = found;
  return pageMeta({
    title: `${project.title} · Aracena Studio`,
    description: project.summary,
    path: `/aracena/proyectos/${project.slug}`,
    brand: "aracena",
    image: project.cover.og ?? undefined,
    type: "article",
  });
}

export default function AracenaProyecto({ params }: PageProps<"/aracena/proyectos/[slug]">) {
  return <ProjectPage brand="aracena" params={params} />;
}
