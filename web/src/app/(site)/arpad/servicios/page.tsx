import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { ContactBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServicePanel } from "@/components/sections/ServicePanel";
import { Tabs } from "@/components/Tabs";
import { getServices } from "@/data/studio";

export const metadata: Metadata = pageMeta({
  title: "Servicios de arquitectura, interiorismo y remodelación · Arpad Studio",
  description: "Diseño arquitectónico, interiores, E-Design, remodelación, modelado 3D y construcción en República Dominicana.",
  path: "/arpad/servicios",
  brand: "arpad",
  image: "/og/p-arpad-tienda-3.jpg",
});

export default async function ArpadServicios() {
  const services = await getServices("arpad");
  return (
    <>
      <PageHeader
        media="arpad-tienda-3"
        eyebrow="Servicios"
        title="Creamos, diseñamos y construimos la visión que sueñas"
        lead="Un mismo estudio del concepto a la entrega, presencial o a distancia."
      />
      {services.length > 0 ? (
        <section className="section" aria-label="Servicios de Arpad Studio">
          <div className="container">
            <Tabs label="Servicios" items={services.map((s) => ({ label: s.title, content: <ServicePanel brand="arpad" service={s} /> }))} />
          </div>
        </section>
      ) : null}
      <ContactBand
        slug="arpad"
        title="¿No sabes qué servicio necesitas?"
        text="Cuéntanos tu idea y te orientamos. La primera conversación es para entender tu proyecto."
        label="Hablar con Arpad Studio"
      />
    </>
  );
}
