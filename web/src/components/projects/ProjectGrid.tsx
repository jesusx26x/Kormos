"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, startTransition, useState, ViewTransition } from "react";
import type { BrandSlug } from "@/lib/brands";
import { whatsappUrl } from "@/lib/whatsapp";
import { IconWhatsApp } from "../Icons";
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
export function ProjectGrid({ brand, projects, categories }: { brand: BrandSlug; projects: ProjectCard[]; categories: string[] }) {
  const [filter, setFilter] = useState<string>("Todos");
  const visible = filter === "Todos" ? projects : projects.filter((p) => p.categories.includes(filter));

  // La rejilla se repite cada 5 piezas (1 apaisada + 4); según dónde termine la
  // lista, la última queda sola en su fila y el CSS la estira (ver data-end).
  const end = (visible.length - 1) % 5;
  // En móvil la lista es larga: una invitación a mitad evita llegar al final sin una salida
  const inviteAfter = visible.length >= 6 ? 4 : -1;

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
          <Fragment key={p.href}>
          <ViewTransition name={`card-${p.href.replaceAll("/", "-")}`}>
            <li className={styles.card} data-wide={i % 5 === 0 || undefined} data-end={i === visible.length - 1 ? end : undefined}>
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
          {i + 1 === inviteAfter ? (
            <li className={styles.invite}>
              <span className={styles.cardMeta}>Contacto</span>
              <span className={styles.cardTitle}>¿Tienes un proyecto en mente?</span>
              <span className={styles.cardSummary}>Escríbenos por WhatsApp, cuéntanos qué quieres lograr y te respondemos.</span>
              <a className="btn" href={whatsappUrl(brand)} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp size={16} /> Escríbenos
              </a>
            </li>
          ) : null}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
