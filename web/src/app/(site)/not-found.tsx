import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BRAND_ORDER, BRANDS } from "@/lib/brands";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="contenido" className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Esta página no existe o cambió de lugar</h1>
      <p className={styles.text}>Puedes volver a la portada o seguir por cualquiera de nuestras marcas.</p>
      <ul className={styles.brands}>
        {BRAND_ORDER.map((slug) => {
          const b = BRANDS[slug];
          return (
            <li key={slug}>
              <Link href={`/${slug}`} className={styles.brand}>
                <Logo name={b.monogram} className={styles.mark} />
                <span>{b.name}</span>
                <span className={styles.desc}>{b.descriptor}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href="/" className={`link-arrow ${styles.home}`}>
        Volver a la portada
      </Link>
    </main>
  );
}
