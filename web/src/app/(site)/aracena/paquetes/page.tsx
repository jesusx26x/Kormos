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
import { getAreaPrices, getFaq, getPackages } from "@/data/packages";
import type { MediaKey } from "@/lib/media.generated";
import { img } from "@/lib/media";

export const metadata: Metadata = pageMeta({
  title: "Paquetes de renders 3D y recorridos virtuales · Aracena Studio",
  description: "Paquetes de renders interiores y exteriores, panorámicas 360° y recorridos virtuales, con precios de referencia por paquete y por área.",
  path: "/aracena/paquetes",
  brand: "aracena",
});

const PROCESS_SLIDES: MediaKey[] = ["aracena-proceso-idea", "aracena-proceso-precios", "aracena-proceso-solicitud", "aracena-proceso-anticipo"];

export default async function AracenaPaquetes() {
  const [packages, areas, faq] = await Promise.all([getPackages(), getAreaPrices(), getFaq()]);
  const hasAreas = areas.exterior.length > 0 || areas.interior.length > 0;
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
        {areas.note && !hasAreas ? <p className={styles.priceNote}>{areas.note}</p> : null}
      </Section>

      {hasAreas ? (
        <Section id="por-area" eyebrow="Por área" title="Renders por área" intro="Para cuando necesitas solo algunos espacios del proyecto.">
          <div className={styles.areaPrices}>
            {(
              [
                ["Exteriores", areas.exterior],
                ["Interiores", areas.interior],
              ] as const
            ).map(([title, rows]) =>
              rows.length ? (
                <Reveal key={title}>
                  <h3 className={styles.areaTitle}>{title}</h3>
                  <ul className={styles.areaList}>
                    {rows.map((row) => (
                      <li key={row.area}>
                        <span>{row.area}</span>
                        <span className={styles.areaPrice}>{row.price}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null,
            )}
          </div>
          {areas.note ? <p className={styles.priceNote}>{areas.note}</p> : null}
        </Section>
      ) : null}

      <section id="solicitud" className={`section ${styles.surface}`} aria-labelledby="solicitud-titulo">
        <div className="container">
          <Reveal as="header" className={styles.sectionHead}>
            <p className="eyebrow">Solicitud</p>
            <h2 id="solicitud-titulo" className={`display ${styles.sectionTitle}`}>
              Crea tu solicitud
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
