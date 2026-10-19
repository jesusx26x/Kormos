import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { AtelierForm } from "@/components/kormos/AtelierForm";
import { Reveal } from "@/components/Reveal";
import { ContactBand } from "@/components/sections/GroupBand";
import { Mosaic } from "@/components/sections/Mosaic";
import { PageHeader } from "@/components/sections/PageHeader";
import { NumberedList, Section, Statement } from "@/components/sections/Section";
import styles from "@/components/sections/Sections.module.css";

export const metadata: Metadata = pageMeta({
  title: "Atelier · Mobiliario a la medida · Kormós",
  description: "Diseñamos contigo y fabricamos para tu espacio: muebles de TV, mesas de comedor, sillas, mobiliario de baño, cocinas modulares y muebles de bar.",
  path: "/kormos/atelier",
  brand: "kormos",
  image: "/og/p-kormos-taller-mueble.jpg",
});

export default function KormosAtelier() {
  return (
    <>
      <PageHeader
        media="kormos-taller-mueble"
        eyebrow="Atelier · Mobiliario a la medida"
        title="Diseñamos contigo. Fabricamos para tu espacio."
        lead="Cada proyecto es una oportunidad para transformar la madera en mobiliario que responde con precisión a tu espacio y a tu forma de habitarlo."
      />

      <Section>
        <Statement quote="Toda pieza comienza con una idea. Una línea, un material, una intención.">
          <p>
            Nuestro trabajo no se limita a las piezas del catálogo: desarrollamos muebles de TV, mesas de comedor, sillas, mobiliario de baño, cocinas modulares, muebles de bar y
            coffee bars, adaptados a las necesidades de cada proyecto.
          </p>
        </Statement>
      </Section>

      <section id="tu-pieza" className={`section ${styles.surface}`} aria-labelledby="tu-pieza-titulo">
        <div className="container">
          <Reveal as="header" className={styles.sectionHead}>
            <p className="eyebrow">Tu pieza</p>
            <h2 id="tu-pieza-titulo" className={`display ${styles.sectionTitle}`}>
              Cuéntanos qué imaginas
            </h2>
            <p className={`lead ${styles.sectionIntro}`}>Con estos datos preparamos una primera propuesta. Se envía por WhatsApp; no hace falta registrarse.</p>
          </Reveal>
          <AtelierForm />
        </div>
      </section>

      <Section eyebrow="Cómo trabajamos" title="Lo hecho a mano lleva tiempo. Y el tiempo es un lujo.">
        <NumberedList
          items={[
            { title: "La idea", text: "Nos cuentas qué necesitas, el espacio y el estilo que buscas." },
            { title: "El diseño", text: "Definimos contigo proporciones, maderas, acabados y tapizados. Si lo necesitas, lo vemos en 3D." },
            { title: "El taller", text: "Fabricamos a mano, cuidando cada corte, cada unión y cada detalle." },
            { title: "La entrega", text: "Instalamos la pieza en tu espacio, lista para habitar." },
          ]}
        />
      </Section>

      <Section tone="surface" eyebrow="Del taller" title="El proceso también es parte de la pieza">
        <Mosaic
          items={[
            { media: "kormos-bano", title: "Mueble de baño y espejo orgánico", meta: "A medida" },
            { media: "kormos-taller-espejo", title: "La idea empieza aquí", meta: "Proceso" },
            { media: "kormos-lavado", title: "Mueble de lavado en verde olivo", meta: "A medida" },
            { media: "kormos-mesa-comedor", title: "Mesa de comedor estriada", meta: "A medida" },
            { media: "kormos-taller-mueble", title: "Cada línea tiene un propósito", meta: "Proceso" },
          ]}
        />
      </Section>

      <ContactBand
        slug="kormos"
        title="Escríbenos para diseñar tu mobiliario deseado"
        text="¿Prefieres conversarlo? Escríbenos directamente y te orientamos."
        label="Hablar con Kormós"
        message="Quiero diseñar una pieza a medida (Atelier)."
      />
    </>
  );
}
