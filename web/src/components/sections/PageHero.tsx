import type { Brand } from "@/lib/brands";
import { whatsappUrl } from "@/lib/whatsapp";
import { IconWhatsApp } from "../Icons";
import { Slideshow } from "../Slideshow";
import styles from "./Sections.module.css";

type PageHeroProps = {
  brand: Brand;
  eyebrow: string;
  title: string;
  lead?: string;
  primary: { label: string; href: string };
};

/** Hero a pantalla completa con fotos protagonistas (patrón Minotti / Entre Dos). */
export function PageHero({ brand, eyebrow, title, lead, primary }: PageHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Slideshow slides={brand.heroMedia} sizes="100vw" eager controls label={`Fotos de ${brand.name}`} />
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={`container ${styles.heroContent}`}>
        <p className={styles.heroEyebrow}>{eyebrow}</p>
        <h1 id="hero-title" className={`display ${styles.heroTitle}`}>
          {title}
        </h1>
        {lead ? <p className={styles.heroLead}>{lead}</p> : null}
        <div className={styles.heroActions}>
          <a className="btn btn--light" href={primary.href}>
            {primary.label}
          </a>
          <a className="btn btn--outline-light" href={whatsappUrl(brand.slug)} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp size={16} /> {brand.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
