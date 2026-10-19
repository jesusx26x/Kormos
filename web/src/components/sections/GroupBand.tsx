import Image from "next/image";
import Link from "next/link";
import { getBrand } from "@/data/studio";
import { heroPics, otherBrands, type BrandSlug } from "@/lib/brands";
import { whatsappUrl } from "@/lib/whatsapp";
import { IconArrow, IconWhatsApp } from "../Icons";
import { Logo } from "../Logo";
import { Reveal } from "../Reveal";
import styles from "./Sections.module.css";

/** Las otras dos marcas del grupo: redundancia de servicios sin recargar la página. */
export async function GroupBand({ slug }: { slug: BrandSlug }) {
  const others = await Promise.all(otherBrands(slug).map((b) => getBrand(b.slug)));
  return (
    <section className="section" aria-labelledby="grupo-titulo">
      <div className="container">
        <Reveal as="header" className={styles.sectionHead}>
          <p className="eyebrow">El grupo</p>
          <h2 id="grupo-titulo" className={`display ${styles.sectionTitle}`}>
            Diseño que se visualiza, se ejecuta y se materializa
          </h2>
        </Reveal>
        <ul className={styles.groupGrid}>
          {others.map((b, i) => {
            const m = heroPics(b)[0];
            return (
              <Reveal as="li" key={b.slug} delay={i * 80}>
                <Link href={`/${b.slug}`} scroll={false} className={styles.groupCard}>
                  <Image src={m.src} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" className={styles.groupImage} style={m.position ? { objectPosition: m.position } : undefined} placeholder={m.blurDataURL ? "blur" : "empty"} blurDataURL={m.blurDataURL ?? undefined} />
                  <span className={styles.groupShade} aria-hidden="true" />
                  <span className={styles.groupBody}>
                    <span className={styles.groupVerb}>{b.verb}</span>
                    <Logo name={b.monogram} className={styles.groupMark} />
                    <span className={styles.groupName}>{b.name}</span>
                    <span className={styles.groupDesc}>{b.descriptor}</span>
                    <span className={styles.groupEnter}>
                      Conocer <IconArrow size={14} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Cierre con llamada a la acción por WhatsApp. */
export function ContactBand({
  slug,
  title,
  text,
  label,
  message,
}: {
  slug: BrandSlug;
  title: string;
  text: string;
  label: string;
  /** Mensaje de WhatsApp ya escrito (p. ej. el proyecto que se estaba viendo), por párrafos */
  message?: string | string[];
}) {
  return (
    <section id="contacto" className={`section ${styles.contact}`} aria-labelledby="contacto-titulo">
      <Reveal className={`container ${styles.contactInner}`}>
        <p className="eyebrow">Contacto</p>
        <h2 id="contacto-titulo" className={`display ${styles.contactTitle}`}>
          {title}
        </h2>
        <p className={`lead ${styles.contactText}`}>{text}</p>
        <a className="btn" href={whatsappUrl(slug, ...(Array.isArray(message) ? message : [message]))} target="_blank" rel="noopener noreferrer">
          <IconWhatsApp size={16} /> {label}
        </a>
      </Reveal>
    </section>
  );
}
