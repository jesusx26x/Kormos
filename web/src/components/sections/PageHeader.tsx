import Image from "next/image";
import Link from "next/link";
import type { MediaKey } from "@/lib/media.generated";
import { img } from "@/lib/media";
import type { Pic } from "@/lib/pic";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  /** Foto fija del diseño o foto subida al panel */
  media: MediaKey | Pic;
  eyebrow: string;
  title: string;
  lead?: string;
  back?: { href: string; label: string };
};

/**
 * Cabecera de las páginas interiores: foto protagonista a 70svh, para que el
 * menú (blanco sobre imagen) siempre tenga contraste, como en Minotti.
 */
export function PageHeader({ media, eyebrow, title, lead, back }: PageHeaderProps) {
  const m = typeof media === "string" ? img(media) : media;
  return (
    <section className={styles.header} aria-labelledby="page-title">
      <Image
        src={m.src}
        alt={m.alt}
        fill
        sizes="100vw"
        quality={85}
        loading="eager"
        fetchPriority="high"
        placeholder={m.blurDataURL ? "blur" : "empty"}
        blurDataURL={m.blurDataURL ?? undefined}
        className={styles.image}
      />
      <div className={styles.shade} aria-hidden="true" />
      <div className={`container ${styles.content}`}>
        {back ? (
          <Link href={back.href} className={styles.back}>
            <span aria-hidden="true">←</span> {back.label}
          </Link>
        ) : null}
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id="page-title" className={`display ${styles.title}`}>
          {title}
        </h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
      </div>
    </section>
  );
}
