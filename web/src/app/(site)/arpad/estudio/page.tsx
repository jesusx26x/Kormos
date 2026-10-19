import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ContactBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section, Statement } from "@/components/sections/Section";
import styles from "@/components/sections/Sections.module.css";
import { getBrand, getTeam, getTestimonials } from "@/data/studio";
import type { MediaKey } from "@/lib/media.generated";
import { img } from "@/lib/media";

export const metadata: Metadata = pageMeta({
  title: "Estudio · Arpad Studio",
  description: "Estudio de arquitectura fundado en 2020, dedicado al diseño y la ejecución de proyectos en República Dominicana.",
  path: "/arpad/estudio",
  brand: "arpad",
  image: "/og/p-arpad-hall.jpg",
});

/** "Arq. Beamel P." → "BP": se omiten títulos abreviados como "Arq." o "Ing.", pero no una inicial como "P.". */
function initials(name: string) {
  const isTitle = (w: string) => w.endsWith(".") && w.length > 2;
  return name
    .split(/\s+/)
    .filter((w) => w && !isTitle(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const MATERIALS: { media: MediaKey; name: string }[] = [
  { media: "arpad-material-1", name: "Madera oscura, travertino y bronce quemado" },
  { media: "arpad-material-2", name: "Nogal, verde profundo y piedra clara" },
  { media: "arpad-material-3", name: "Madera natural, piedra clara y metal oscuro" },
];

export default async function ArpadEstudio() {
  const [brand, team, testimonials] = await Promise.all([getBrand("arpad"), getTeam("arpad"), getTestimonials("arpad")]);
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

      {team.length > 0 ? (
        <Section tone="surface" eyebrow="Equipo" title="Quienes diseñan y ejecutan">
          <ul className={styles.team}>
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} className={styles.member} delay={i * 60}>
                {m.photo ? (
                  <span className={styles.memberPhoto}>
                    <Image src={m.photo.src} alt="" fill sizes="72px" className={styles.tileImage} />
                  </span>
                ) : (
                  <span className={styles.memberMark} aria-hidden="true">
                    {initials(m.name)}
                  </span>
                )}
                <span className={styles.memberName}>{m.name}</span>
                <span className={styles.memberRole}>{m.role}</span>
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      {testimonials.length > 0 ? (
        <Section eyebrow="Testimonios" title="Lo que dicen nuestros clientes">
          <ul className={styles.testimonials}>
            {testimonials.map((t, i) => (
              <Reveal as="li" key={`${t.author}-${i}`} className={styles.testimonial} delay={i * 60}>
                <blockquote className={styles.testimonialQuote}>{t.quote}</blockquote>
                <p className={styles.testimonialAuthor}>
                  {t.author}
                  {t.detail ? <span className={styles.memberRole}>{t.detail}</span> : null}
                </p>
                {t.href ? (
                  <Link href={t.href} className="link-arrow">
                    Ver el proyecto
                  </Link>
                ) : null}
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

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

      <ContactBand
        slug="arpad"
        title="Conversemos sobre tu espacio"
        text="Escríbenos por WhatsApp y te contamos cómo podemos ayudarte."
        label="Contactar a Arpad Studio"
      />
    </>
  );
}
