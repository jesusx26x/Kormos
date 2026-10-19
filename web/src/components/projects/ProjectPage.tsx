import { notFound } from "next/navigation";
import { getProject } from "@/data/projects";
import type { BrandSlug } from "@/lib/brands";
import { ProjectDetail } from "./ProjectDetail";

/**
 * Ruta de detalle de proyecto. Los proyectos existentes se prerenderizan en
 * el build (generateStaticParams), así que el HTML sale completo y en línea,
 * sin armazón ni contenido oculto: mejor para SEO y para quien no ejecuta JS.
 * Por eso la página declara `instant = false` en lugar de usar <Suspense>.
 */
export async function ProjectPage({ brand, params }: { brand: BrandSlug; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = await getProject(brand, slug);
  if (!found) notFound();
  return <ProjectDetail project={found.project} next={found.next} />;
}
