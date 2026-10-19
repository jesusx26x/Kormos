import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import type { Metadata } from "next";
import { BriefForm } from "@/components/BriefForm";
import { Reveal } from "@/components/Reveal";
import { PackageGrid } from "@/components/sections/Cards";
import { ContactBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/sections/Section";
import styles from "@/components/sections/Sections.module.css";
import { getFaq, getPackages } from "@/data/packages";
import type { MediaKey } from "@/lib/media.generated";
import { img } from "@/lib/media";

export const metadata: Metadata = pageMeta({
  title: "Paquetes de render · Aracena Studio",
  description: "Render interior, render exterior, recorridos virtuales y material para ventas. Precio según el tipo y la escala del proyecto.",
  path: "/aracena/paquetes",
  brand: "aracena",
});

const PROCESS_SLIDES: MediaKey[] = ["aracena-proceso-idea", "aracena-proceso-precios", "aracena-proceso-solicitud", "aracena-proceso-anticipo"];

export default async function AracenaPaquetes() {
  const [packages, faq] = await Promise.all([getPackages(), getFaq()]);
  return (
    <>
      <PageHeader
        media="aracena-terraza-mar"
        eyebrow="Paquetes"
        title="Precios pensados para cada caso"
        lead="Cada paquete se ajusta al tipo de proyecto, su escala y lo que necesitas comunicar."
      />

      <Section eyebrow="Catálogo de servicios" title="Elige cómo quieres mostrar tu proyecto">
        <PackageGrid slug="aracena" items={packages} />
      </Section>

      <section id="solicitud" className={`section ${styles.surface}`} aria-labelledby="solicitud-titulo">
        <div className="container">
          <Reveal as="header" className={styles.sectionHead}>
            <p className="eyebrow">Solicitud</p>
            <h2 id="solicitud-titulo" className={`display ${styles.sectionTitle}`}>
              Arma tu solicitud
            </h2>
            <p className={`lead ${styles.sectionIntro}`}>Con estos datos podemos cotizar sin vueltas. Se envía por WhatsApp, el canal oficial de solicitudes.</p>
          </Reveal>
          <BriefForm packages={packages.map((p) => p.name)} />
        </div>
      </section>

      <Section id="proceso" eyebrow="Proceso" title="Así se construyen nuestros renders">
        <ul className={styles.slides}>
          {PROCESS_SLIDES.map((key, i) => {
            const m = img(key);
            return (
              <Reveal as="li" key={key} delay={i * 60}>
                <div className={styles.slideMedia}>
                  <Image src={m.src} alt={m.alt} fill sizes="(max-width: 899px) 50vw, 25vw" placeholder={m.blurDataURL ? "blur" : "empty"} blurDataURL={m.blurDataURL ?? undefined} className={styles.tileImage} />
                </div>
              </Reveal>
            );
          })}
        </ul>
        <div className={styles.faq}>
          {faq.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <ContactBand
        slug="aracena"
        title="Cada solicitud merece atención real"
        text="¿Prefieres conversarlo primero? Escríbenos y te orientamos sobre el paquete que mejor se ajusta."
        label="Escribir a Aracena Studio"
      />
    </>
  );
}
