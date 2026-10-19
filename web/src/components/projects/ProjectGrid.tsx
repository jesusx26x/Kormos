"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useState, ViewTransition } from "react";
import styles from "./Projects.module.css";

export type ProjectCard = {
  href: string;
  title: string;
  summary: string;
  categories: string[];
  location?: string;
  image: { src: string; alt: string; blurDataURL: string | null };
};

/**
 * Portafolio con filtros. El cambio de filtro va en una transición de React
 * para que <ViewTransition> anime entradas, salidas y reacomodos (solo
 * transform/opacity, gestionado por el navegador). Los filtros son botones
 * con aria-pressed y el recuento se anuncia a lectores de pantalla.
 */
export function ProjectGrid({ projects, categories }: { projects: ProjectCard[]; categories: string[] }) {
  const [filter, setFilter] = useState<string>("Todos");
  const visible = filter === "Todos" ? projects : projects.filter((p) => p.categories.includes(filter));

  function choose(value: string) {
    startTransition(() => setFilter(value));
  }

  return (
    <div>
      <div className={styles.filters} role="group" aria-label="Filtrar proyectos">
        {["Todos", ...categories].map((c) => (
          <button key={c} type="button" className={styles.filter} aria-pressed={filter === c} onClick={() => choose(c)}>
            {c}
          </button>
        ))}
        <p className={styles.count} role="status" aria-live="polite">
          {visible.length} {visible.length === 1 ? "proyecto" : "proyectos"}
        </p>
      </div>

      <ul className={styles.grid}>
        {visible.map((p, i) => (
          <ViewTransition key={p.href} name={`card-${p.href.replaceAll("/", "-")}`}>
            <li className={styles.card} data-wide={i % 5 === 0 || undefined}>
              <Link href={p.href} className={styles.cardLink}>
                <span className={styles.cardMedia}>
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 33vw"
                    placeholder={p.image.blurDataURL ? "blur" : "empty"}
                    blurDataURL={p.image.blurDataURL ?? undefined}
                    className={styles.cardImage}
                  />
                </span>
                <span className={styles.cardMeta}>{[p.location, ...p.categories].filter(Boolean).join(" · ")}</span>
                <span className={styles.cardTitle}>{p.title}</span>
                <span className={styles.cardSummary}>{p.summary}</span>
              </Link>
            </li>
          </ViewTransition>
        ))}
      </ul>
    </div>
  );
}
