import { BrandIntro } from "@/components/BrandIntro";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { BeforeAfter } from "@/components/projects/BeforeAfter";
import { ContactBand, GroupBand } from "@/components/sections/GroupBand";
import { Mosaic } from "@/components/sections/Mosaic";
import { PageHero } from "@/components/sections/PageHero";
import { NumberedList, Section, Statement } from "@/components/sections/Section";
import styles from "@/components/sections/Sections.module.css";
import { BRANDS } from "@/lib/brands";
import { img } from "@/lib/media";

export const metadata: Metadata = pageMeta({
  title: "Arpad Studio · Arquitectura, Diseño y Construcción",
  description: "Estudio de arquitectura en República Dominicana: diseño arquitectónico, interiores, E-Design, remodelación, modelado 3D y construcción.",
  path: "/arpad",
  brand: "arpad",
});

const brand = BRANDS.arpad;

export default function ArpadInicio() {
  return (
    <>
      <BrandIntro slug="arpad" />
      <PageHero
        brand={brand}
        eyebrow="Arquitectura · Diseño · Construcción — Desde 2020"
        title="Espacios con intención, estética y funcionalidad."
        lead="Diseñamos y ejecutamos proyectos que se sienten como hogar: materiales bien elegidos, luz como elemento arquitectónico y una ejecución cuidada de principio a fin."
        primary={{ label: "Ver proyectos", href: "#proyectos" }}
      />

      <Section id="estudio">
        <Statement quote="El mejor diseño no es el que simplemente se ve bonito; es el que logra sentirse como hogar.">
          <p>{brand.intro}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Fundado</dt>
              <dd>2020</dd>
            </div>
            <div>
              <dt>Enfoque</dt>
              <dd>Diseño y ejecución</dd>
            </div>
            <div>
              <dt>Alcance</dt>
              <dd>Presencial y E-Design</dd>
            </div>
          </dl>
        </Statement>
      </Section>

      <Section
        id="proyectos"
        tone="surface"
        eyebrow="Proyectos"
        title="Arquitectura que respira luz, modernidad y naturaleza"
        intro="Residencias, fachadas remodeladas, áreas sociales y espacios comerciales. Renders de Aracena Studio; mobiliario a medida de Kormós."
      >
        <Mosaic
          items={[
            { media: "arpad-villa", title: "Villa contemporánea", meta: "Diseño de proyecto" },
            { media: "arpad-piscina", title: "Área social con piscina", meta: "Diseño exterior" },
            { media: "arpad-fachada-noche", title: "Fachada reinterpretada", meta: "Remodelación" },
            { media: "arpad-hall", title: "Hall de entrada", meta: "Interiorismo · Kormós" },
            { media: "arpad-tienda", title: "Tienda", meta: "E-Design" },
            { media: "arpad-villa-2", title: "Villa con vistas abiertas", meta: "Diseño de proyecto" },
          ]}
        />
        <div className={styles.sectionMore}>
          <Link href="/arpad/proyectos" className="link-arrow">
            Ver todos los proyectos
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Antes y después"
        title="No es cambiar la arquitectura, sino reinterpretarla"
        intro="Desliza para comparar la fachada original con la propuesta: líneas más claras e iluminación que resalta los volúmenes."
      >
        <BeforeAfter before={img("arpad-fachada-noche-antes")} after={img("arpad-fachada-noche")} label="Fachada reinterpretada" />
        <div className={styles.sectionMore}>
          <Link href="/arpad/proyectos/fachada-reinterpretada" className="link-arrow">
            Ver el proyecto
          </Link>
        </div>
      </Section>

      <Section
        id="servicios"
        tone="surface"
        eyebrow="Servicios"
        title="Creamos, diseñamos y construimos la visión que sueñas"
      >
        <NumberedList
          items={[
            { title: "Diseño arquitectónico", text: "Proyectos residenciales y comerciales: concepto, distribución, volumetría y planos." },
            { title: "Diseño de interiores", text: "Materialidad, atmósfera y mobiliario pensados para quien habita el espacio." },
            { title: "E-Design", text: "Diseño completamente digital y a distancia, con el mismo nivel de detalle." },
            { title: "Remodelación", text: "Del antes al después: reinterpretamos fachadas e interiores para llevarlos a su mejor versión." },
            { title: "Modelado 3D", text: "Visualiza tu proyecto antes de construirlo, con renders hiperrealistas de Aracena Studio." },
            { title: "Construcción y ejecución", text: "Llevamos el diseño a obra y cuidamos cada detalle hasta la entrega." },
          ]}
        />
        <div className={styles.sectionMore}>
          <Link href="/arpad/servicios" className="link-arrow">
            Conocer los servicios
          </Link>
        </div>
      </Section>

      <GroupBand slug="arpad" />

      <ContactBand
        slug="arpad"
        title="¿Tienes un proyecto en mente?"
        text="Cuéntanos qué quieres construir o transformar. Te respondemos por WhatsApp para agendar una primera conversación."
        label="Contactar a Arpad Studio"
      />
    </>
  );
}
