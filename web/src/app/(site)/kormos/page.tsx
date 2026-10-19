import { BrandIntro } from "@/components/BrandIntro";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { CollectionGrid, Split } from "@/components/sections/Cards";
import { ContactBand, GroupBand } from "@/components/sections/GroupBand";
import { Mosaic } from "@/components/sections/Mosaic";
import { PageHero } from "@/components/sections/PageHero";
import { NumberedList, Section, Statement } from "@/components/sections/Section";
import styles from "@/components/sections/Sections.module.css";
import { Reveal } from "@/components/Reveal";
import { BRANDS } from "@/lib/brands";

export const metadata: Metadata = pageMeta({
  title: "Kormós · Furniture Design",
  description: "Atelier de ebanistería contemporánea en República Dominicana: mobiliario a medida donde la madera, el diseño y la arquitectura se encuentran.",
  path: "/kormos",
  brand: "kormos",
});

const brand = BRANDS.kormos;

const MATERIALES = [
  "Pino tratado",
  "Congona",
  "Caoba",
  "Cedro",
  "Roble",
  "Roble brasileño",
  "Teka",
  "Nogal",
  "MDF Jequitibá",
  "MDF laminado",
  "Melamina",
  "MDF hidrófugo",
];

export default function KormosInicio() {
  return (
    <>
      <BrandIntro slug="kormos" />
      <PageHero
        brand={brand}
        eyebrow="Atelier · Ebanistería contemporánea — Est. 2025"
        title="More than furniture."
        lead="Mobiliario a medida donde la madera, el diseño y la arquitectura se encuentran. Diseño · Precisión · Carácter."
        primary={{ label: "Ver la colección", href: "#coleccion" }}
      />

      <Section>
        <Statement quote="Lo hecho a mano lleva tiempo. Y el tiempo es un lujo.">
          <p>{brand.intro}</p>
          <p>Cada pieza se puede personalizar en dimensiones, acabados y tapizados, y está disponible en formato SketchUp (.skp) para integrarla a tus proyectos.</p>
        </Statement>
      </Section>

      <Section
        id="coleccion"
        eyebrow="Colección Origen"
        title="Piezas pensadas para perdurar"
        intro="Piezas diseñadas por Kormós y fabricadas bajo pedido. Elige el acabado, arma tu selección y cotízala por WhatsApp."
      >
        <CollectionGrid
          items={[
            { media: "kormos-pieza-ottoman", name: "Ottomanes", pieces: "Bruma · Nórdico · Trama · Nodo · Arlo", note: "Pino · telas a elegir", href: "/kormos/catalogo#ottomanes" },
            { media: "kormos-pieza-auxiliar", name: "Mesas auxiliares", pieces: "Ela y otras tres piezas", note: "Madera a elección", href: "/kormos/catalogo#mesas-auxiliares" },
            { media: "kormos-pieza-noche", name: "Mesas de noche", pieces: "Alma · Aura · Noa · Lena", note: "Medidas estándar", href: "/kormos/catalogo#mesas-de-noche" },
            { media: "kormos-pieza-centro", name: "Mesas de centro", pieces: "A dos alturas y otras dos piezas", note: "Medidas a elegir", href: "/kormos/catalogo#mesas-de-centro" },
            { media: "kormos-pieza-espejo", name: "Marcos para espejo", pieces: "Formas orgánicas", note: "Madera a elección", href: "/kormos/catalogo#espejos" },
            { media: "kormos-pieza-cuadro", name: "Cuadros de madera", pieces: "Relieves y texturas", note: "Diseños a elegir", href: "/kormos/catalogo#cuadros" },
          ]}
        />
        <div className={styles.sectionMore}>
          <Link href="/kormos/catalogo" className="link-arrow">
            Ver el catálogo completo
          </Link>
        </div>
      </Section>

      <Section id="atelier" tone="surface">
        <Split media="kormos-taller-espejo">
          <p className="eyebrow">Atelier · Mobiliario a la medida</p>
          <h2 className={`display ${styles.sectionTitle}`}>Diseñamos contigo. Fabricamos para tu espacio.</h2>
          <p>Nuestro trabajo no se limita al catálogo: desarrollamos muebles de TV, mesas de comedor, sillas, mobiliario de baño, cocinas modulares, muebles de bar y coffee bars, adaptados a cada proyecto.</p>
          <NumberedList
            compact
            items={[
              { title: "La idea", text: "Nos cuentas qué necesitas, el espacio y el estilo que buscas." },
              { title: "El diseño", text: "Definimos proporciones, materiales y acabados contigo." },
              { title: "El taller", text: "Fabricamos a mano, con tiempo y precisión, hasta la entrega." },
            ]}
          />
          <Link className="btn" href="/kormos/atelier">
            Diseñar mi pieza
          </Link>
        </Split>
      </Section>

      <Section id="proyectos" eyebrow="Proyectos" title="El proceso también es parte de la pieza">
        <Mosaic
          items={[
            { media: "kormos-bano", title: "Mueble de baño y espejo orgánico", meta: "A medida" },
            { media: "kormos-lavado", title: "Mueble de lavado en verde olivo", meta: "A medida" },
            { media: "kormos-mesa-comedor", title: "Mesa de comedor de base estriada", meta: "Pieza única" },
            { media: "kormos-bench", title: "Bench tapizado", meta: "Madera y textil" },
            { media: "kormos-taller-mueble", title: "Del taller", meta: "Proceso" },
          ]}
        />
      </Section>

      <Section id="materiales" tone="surface" eyebrow="Materiales y acabados" title="La madera a tu elección">
        <Reveal as="ul" className={styles.chips}>
          {MATERIALES.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </Reveal>
      </Section>

      <GroupBand slug="kormos" />

      <ContactBand
        slug="kormos"
        title="Escríbenos para diseñar tu mobiliario deseado"
        text="Comparte tu idea, las medidas aproximadas y el espacio. Te respondemos por WhatsApp con la propuesta y la cotización."
        label="Diseñar con Kormós"
      />
    </>
  );
}
