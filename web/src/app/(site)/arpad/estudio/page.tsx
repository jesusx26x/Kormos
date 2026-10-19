import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ContactBand, GroupBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section, Statement } from "@/components/sections/Section";
import styles from "@/components/sections/Sections.module.css";
import { BRANDS } from "@/lib/brands";
import type { MediaKey } from "@/lib/media.generated";
import { img } from "@/lib/media";

export const metadata: Metadata = pageMeta({
  title: "Estudio · Arpad Studio",
  description: "Estudio de arquitectura fundado en 2020, dedicado al diseño y la ejecución de proyectos en República Dominicana.",
  path: "/arpad/estudio",
  brand: "arpad",
  image: "/og/p-arpad-hall.jpg",
});

// Equipo tal como figura en la biografía pública de Instagram: confirmar nombres, cargos y fotos con el estudio.
const TEAM = [
  { name: "Arq. Beamel P.", initials: "BP", role: "Arquitectura · Diseño y ejecución" },
  { name: "Arq. Brayant A.", initials: "BA", role: "Arquitectura · Diseño y visualización" },
];

const MATERIALS: { media: MediaKey; name: string }[] = [
  { media: "arpad-material-1", name: "Madera oscura, travertino y bronce quemado" },
  { media: "arpad-material-2", name: "Nogal, verde profundo y piedra clara" },
  { media: "arpad-material-3", name: "Madera natural, piedra clara y metal oscuro" },
];

export default function ArpadEstudio() {
  const brand = BRANDS.arpad;
  return (
    <>
      <PageHeader media="arpad-hall" eyebrow="Estudio · Desde 2020" title="Arquitectura, diseño y construcción" lead={brand.tagline} />

      <Section>
        <Statement quote="El secreto no es diseñar por diseñar, sino seleccionar materiales que mantengan su esencia con el tiempo.">
          <p>{brand.intro}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Fundado</dt>
              <dd>2020</dd>
            </div>
            <div>
              <dt>Enfoque</dt>
              <dd>Concepto · Materialidad · Atmósfera</dd>
            </div>
          </dl>
        </Statement>
      </Section>

      <Section tone="surface" eyebrow="Equipo" title="Quienes diseñan y ejecutan">
        <ul className={styles.team}>
          {TEAM.map((m, i) => (
            <Reveal as="li" key={m.name} className={styles.member} delay={i * 60}>
              <span className={styles.memberMark} aria-hidden="true">
                {m.initials}
              </span>
              <span className={styles.memberName}>{m.name}</span>
              <span className={styles.memberRole}>{m.role}</span>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Materialidad"
        title="Las cocinas no dependen del color de moda, sino de buenas combinaciones"
        intro="Tres combinaciones, un mismo criterio: materiales reales y diseño que permanece."
      >
        <ul className={styles.materials}>
          {MATERIALS.map((mat, i) => {
            const m = img(mat.media);
            return (
              <Reveal as="li" key={mat.media} delay={i * 60}>
                <div className={styles.materialMedia}>
                  <Image src={m.src} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" placeholder={m.blurDataURL ? "blur" : "empty"} blurDataURL={m.blurDataURL ?? undefined} className={styles.tileImage} />
                </div>
                <p className={styles.materialName}>{mat.name}</p>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <GroupBand slug="arpad" />
      <ContactBand
        slug="arpad"
        title="Conversemos sobre tu espacio"
        text="Escríbenos por WhatsApp y te contamos cómo podemos ayudarte."
        label="Contactar a Arpad Studio"
      />
    </>
  );
}
