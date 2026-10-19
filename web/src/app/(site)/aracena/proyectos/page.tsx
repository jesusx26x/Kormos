import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { projectCards } from "@/components/projects/cards";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ContactBand, GroupBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata: Metadata = pageMeta({
  title: "Proyectos · Aracena Studio",
  description: "Renders hiperrealistas de interiores y exteriores para arquitectos, interioristas y desarrolladores.",
  path: "/aracena/proyectos",
  brand: "aracena",
  image: "/og/p-aracena-living.jpg",
});

export default async function AracenaProyectos() {
  const { projects, categories } = await projectCards("aracena");
  return (
    <>
      <PageHeader
        media="aracena-living"
        eyebrow="Proyectos"
        title="Imágenes que comunican, venden y emocionan"
        lead="Diseños de distintos orígenes llevados a renders hiperrealistas. Cada imagen lleva el crédito del diseño original."
      />
      <section className="section" aria-label="Portafolio de renders">
        <div className="container">
          <ProjectGrid brand="aracena" projects={projects} categories={categories} />
        </div>
      </section>
      <GroupBand slug="aracena" />
      <ContactBand
        slug="aracena"
        title="¿Tu proyecto necesita brillar?"
        text="Envíanos el tipo de proyecto, la escala y el plazo y te respondemos con una propuesta."
        label="Solicitar un render"
      />
    </>
  );
}
