import Link from "next/link";
import styles from "./BackFloat.module.css";

/**
 * "Volver" fijo abajo a la izquierda en el celular, en las fichas: al bajar
 * por una pieza o un proyecto, el enlace de arriba queda lejos y la barra del
 * navegador se esconde.
 */
export function BackFloat({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={styles.back}>
      <span aria-hidden="true">←</span> {label}
    </Link>
  );
}
