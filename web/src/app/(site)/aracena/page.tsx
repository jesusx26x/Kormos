import { BrandIntro } from "@/components/BrandIntro";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { PackageGrid } from "@/components/sections/Cards";
import { ContactBand, GroupBand } from "@/components/sections/GroupBand";
import { Mosaic } from "@/components/sections/Mosaic";
import { PageHero } from "@/components/sections/PageHero";
import { NumberedList, Section, Statement } from "@/components/sections/Section";
import styles from "@/components/sections/Sections.module.css";
import { getPackages } from "@/data/packages";
import { getBrand } from "@/data/studio";

export const metadata: Metadata = pageMeta({
  title: "Aracena Studio · Renders 3D y visualización arquitectónica en República Dominicana",
  description: "Estudio de visualización arquitectónica: renders hiperrealistas de interiores y exteriores, recorridos virtuales y material para ventas.",
  path: "/aracena",
  brand: "aracena",
});

export default async function AracenaInicio() {
  const [brand, packages] = await Promise.all([getBrand("aracena"), getPackages()]);
  return (
    <>
      <BrandIntro slug="aracena" />
      <PageHero
        brand={brand}
        eyebrow="Rendering Projects — Desde 2018"
        title="Un buen render no solo muestra… transmite."
        lead="Renders hiperrealistas que comunican, venden y emocionan. Anticipamos lo que se sentirá al habitar un espacio antes de colocar el primer bloque."
        primary={{ label: "Ver proyectos", href: "#proyectos" }}
      />

      <Section>
        <Statement quote="Cada proyecto tiene una esencia; nuestro trabajo es llevarla a su máxima expresión.">
          <p>{brand.intro}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Desde</dt>
              <dd>2018</dd>
            </div>
            <div>
              <dt>Motor</dt>
              <dd>V-Ray</dd>
            </div>
            <div>
              <dt>Para</dt>
              <dd>Arquitectos e interioristas</dd>
            </div>
          </dl>
        </Statement>
      </Section>

      <Section
        id="proyectos"
        tone="surface"
        eyebrow="Proyectos"
        title="Diseños de distintos orígenes, una misma atención al detalle"
        intro="Trabajamos con arquitectos, interioristas y constructoras. Cada render lleva el crédito del diseño original."
      >
        <Mosaic
          items={[
            { media: "aracena-terraza-mar", title: "Terraza frente al mar", meta: "Las Terrenas, Samaná" },
            { media: "aracena-living", title: "Living", meta: "Diseño: Amanda Musa ID" },
            { media: "aracena-habitacion", title: "Habitación principal", meta: "Diseño: Amanda Musa ID" },
            { media: "aracena-bano", title: "Baño", meta: "Diseño: Amanda Musa ID" },
            { media: "aracena-living-2", title: "Living en Punta Cana", meta: "Diseño: Xenarch Studio" },
            { media: "aracena-jardin", title: "Jardín interior", meta: "Diseño: Arpad Studio" },
          ]}
        />
        <div className={styles.sectionMore}>
          <Link href="/aracena/proyectos" className="link-arrow">
            Ver todos los proyectos
          </Link>
        </div>
      </Section>

      <Section
        id="paquetes"
        eyebrow="Paquetes"
        title="Precios pensados para cada caso"
        intro="No manejamos presupuestos genéricos: cada paquete se ajusta al tipo de proyecto, su escala y lo que necesitas comunicar."
      >
        <PackageGrid slug="aracena" items={packages} />
        <div className={styles.sectionMore}>
          <Link href="/aracena/paquetes#solicitud" className="link-arrow">
            Armar mi solicitud
          </Link>
        </div>
      </Section>

      <Section id="proceso" tone="surface" eyebrow="Proceso" title="Así se construyen nuestros renders">
        <NumberedList
          items={[
            { title: "Todo inicia con una idea", text: "Antes de cualquier render escuchamos y entendemos lo que quieres comunicar con tu espacio." },
            { title: "Una propuesta a tu medida", text: "Ajustamos el servicio al tipo de proyecto, su escala y tus necesidades." },
            { title: "Agenda y calendario definidos", text: "Programamos cada proyecto para cuidar los tiempos de entrega y el estándar de calidad." },
            { title: "Empezar bien", text: "Todo proyecto inicia con un anticipo; con clientes nuevos firmamos una carta de compromiso." },
          ]}
        />
      </Section>

      <GroupBand slug="aracena" />

      <ContactBand
        slug="aracena"
        title="Cada solicitud merece atención real"
        text="Escríbenos con el tipo de proyecto, su escala y el plazo. Las solicitudes se atienden por los canales oficiales: WhatsApp y correo."
        label="Solicitar un render"
      />
    </>
  );
}
