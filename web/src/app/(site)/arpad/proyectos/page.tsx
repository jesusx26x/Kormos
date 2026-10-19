import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { projectCards } from "@/components/projects/cards";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ContactBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata: Metadata = pageMeta({
  title: "Proyectos · Arpad Studio",
  description: "Residencias, remodelaciones de fachada, interiorismo y espacios comerciales diseñados y ejecutados por Arpad Studio.",
  path: "/arpad/proyectos",
  brand: "arpad",
  image: "/og/p-arpad-piscina.jpg",
});

export default async function ArpadProyectos() {
  const { projects, categories } = await projectCards("arpad");
  return (
    <>
      <PageHeader
        media="arpad-piscina"
        eyebrow="Proyectos"
        title="Espacios que se sienten como hogar"
        lead="Residencias, remodelaciones, interiorismo y espacios comerciales. Diseño y ejecución de Arpad Studio, renders de Aracena Studio y mobiliario de Kormós."
      />
      <section className="section" aria-label="Portafolio">
        <div className="container">
          <ProjectGrid brand="arpad" projects={projects} categories={categories} />
        </div>
      </section>
      <ContactBand
        slug="arpad"
        title="¿Tienes un proyecto en mente?"
        text="Cuéntanos qué quieres construir o transformar y agendamos una primera conversación."
        label="Contactar a Arpad Studio"
      />
    </>
  );
}
