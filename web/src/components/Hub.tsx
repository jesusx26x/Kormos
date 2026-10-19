import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { COPYRIGHT_YEAR, GROUP_TAGLINE, heroPics, type Brand } from "@/lib/brands";
import { IconArrow } from "./Icons";
import { Logo } from "./Logo";
import { LogoAnimated } from "./LogoAnimated";
import { PauseButton, PauseProvider } from "./PauseContext";
import { Preloader } from "./Preloader";
import { ScrollToTop } from "./ScrollToTop";
import { Slideshow } from "./Slideshow";
import styles from "./Hub.module.css";

/**
 * Portada: las tres marcas al mismo nivel (mismo ancho y mismo tratamiento),
 * en orden alfabético. Las une el flujo del grupo:
 * se visualiza (Aracena) → se ejecuta (Arpad) → se materializa (Kormós).
 */
export function Hub({ brands }: { brands: Brand[] }) {
  return (
    <PauseProvider>
      <ScrollToTop />
      <Preloader caption={GROUP_TAGLINE}>
        {brands.map((brand, i) => (
          <LogoAnimated key={brand.slug} name={brand.monogram} delay={i * 140} />
        ))}
      </Preloader>

      <main id="contenido" className={styles.hub}>
        <h1 className="visually-hidden">Aracena Studio, Arpad Studio y Kormós</h1>
        <p className={styles.tagline}>{GROUP_TAGLINE}</p>

        <ul className={styles.panels}>
          {brands.map((brand, i) => {
            const slug = brand.slug;
            return (
              <li key={slug} className={styles.panel} data-brand={slug} style={{ "--i": i } as CSSProperties}>
                <Link href={`/${slug}`} scroll={false} className={styles.link}>
                  <Slideshow
                    slides={heroPics(brand)}
                    interval={7000}
                    offset={i * 2300}
                    sizes="(max-width: 767px) 100vw, 34vw"
                    eager
                    label={`Fotos de ${brand.name}`}
                    decorative
                  />
                  <span className={styles.shade} aria-hidden="true" />
                  <span className={styles.content}>
                    <span className={styles.verb}>{brand.verb}</span>
                    <ViewTransition name={`marca-${slug}`}>
                      <Logo name={brand.monogram} className={styles.mark} />
                    </ViewTransition>
                    <span className={`display ${styles.name}`}>{brand.displayName}</span>
                    <span className={styles.descriptor}>{brand.descriptor}</span>
                    <span className={styles.enter}>
                      Entrar <span className="visually-hidden">a {brand.name}</span>
                      <IconArrow size={16} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.footer}>
          <span>© {COPYRIGHT_YEAR} · Todos los derechos reservados</span>
          <PauseButton className={styles.pause} />
        </div>
      </main>
    </PauseProvider>
  );
}
