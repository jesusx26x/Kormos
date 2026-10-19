import { ViewTransition } from "react";
import type { Brand } from "@/lib/brands";
import { Logo } from "./Logo";
import styles from "./BrandLockup.module.css";

type BrandLockupProps = {
  brand: Brand;
  /** header: logotipo horizontal · stacked: monograma + nombre (portada, pie) */
  variant?: "header" | "stacked";
  className?: string;
};

/**
 * Logotipo de cada marca. El elemento visual principal lleva el nombre de
 * transición `marca-<slug>` para que viaje de la portada a la cabecera.
 */
export function BrandLockup({ brand, variant = "header", className }: BrandLockupProps) {
  if (variant === "header" && brand.wordmark) {
    return (
      <span className={[styles.lockup, styles[`h_${brand.slug}`], className].filter(Boolean).join(" ")}>
        <ViewTransition name={`marca-${brand.slug}`}>
          <Logo name={brand.wordmark} title={brand.name} className={styles.wordmark} />
        </ViewTransition>
      </span>
    );
  }

  return (
    <span
      className={[styles.lockup, variant === "stacked" ? styles.stacked : styles.inline, styles[`h_${brand.slug}`], className]
        .filter(Boolean)
        .join(" ")}
    >
      <ViewTransition name={`marca-${brand.slug}`}>
        <Logo name={brand.monogram} className={styles.monogram} />
      </ViewTransition>
      <span className={styles.text}>
        <span className={styles.name}>{brand.wordmarkText?.name ?? brand.displayName}</span>
        <span className={styles.sub}>{brand.wordmarkText?.sub ?? brand.descriptor}</span>
      </span>
    </span>
  );
}
