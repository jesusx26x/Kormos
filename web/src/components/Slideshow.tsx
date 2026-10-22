"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Pic } from "@/lib/pic";
import { IconPause, IconPlay } from "./Icons";
import { usePause } from "./PauseContext";
import styles from "./Slideshow.module.css";

type SlideshowProps = {
  slides: Pic[];
  /** Milisegundos por diapositiva */
  interval?: number;
  /** Desfase inicial para que varios slideshows no cambien a la vez */
  offset?: number;
  sizes: string;
  /** La primera foto se ve al cargar: se descarga sin esperar */
  eager?: boolean;
  /** La primera foto es el LCP de la página: se descarga antes que las demás */
  priority?: boolean;
  quality?: 75 | 85;
  /** Pausa controlada desde fuera (p. ej. un botón global de la portada) */
  paused?: boolean;
  /** Muestra contador, barra de progreso y botón de pausa */
  controls?: boolean;
  label: string;
  /** Fotos de ambiente dentro de un enlace: sin texto alternativo ni rol de carrusel */
  decorative?: boolean;
  className?: string;
};

/**
 * Fundido entre fotos con zoom lento (Ken Burns). Cumple WCAG para contenido
 * que rota solo: botón de pausa y se detiene con foco dentro o con la pestaña
 * oculta.
 */
export function Slideshow({
  slides,
  interval = 6500,
  offset = 0,
  sizes,
  eager = false,
  priority = eager,
  quality = 85,
  paused: pausedFromParent = false,
  controls = false,
  label,
  decorative = false,
  className,
}: SlideshowProps) {
  const [index, setIndex] = useState(0);
  // Solo se montan la foto actual y la siguiente: el resto se carga cuando toca
  const [reach, setReach] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [hidden, setHidden] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const shared = usePause();
  const paused =
    userPaused || pausedFromParent || !!shared?.paused || focusInside || hidden || slides.length < 2;

  useEffect(() => {
    if (paused) return;
    const first = index === 0 && offset > 0 ? interval + offset : interval;
    const next = (index + 1) % slides.length;
    const t = window.setTimeout(() => {
      setIndex(next);
      setReach((r) => Math.max(r, next));
    }, first);
    return () => window.clearTimeout(t);
  }, [index, paused, interval, offset, slides.length]);

  return (
    <div
      ref={root}
      className={[styles.slideshow, className].filter(Boolean).join(" ")}
      role={decorative ? undefined : "group"}
      aria-roledescription={decorative ? undefined : "carrusel"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      onFocus={() => setFocusInside(true)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setFocusInside(false);
      }}
      style={{ "--interval": `${interval}ms` } as CSSProperties}
      data-paused={paused || undefined}
    >
      {slides.map((m, i) => {
        const active = i === index;
        return (
          <div
            key={`${i}-${m.src}`}
            className={styles.slide}
            data-active={active || undefined}
            aria-hidden={!active}
          >
            {i <= reach + 1 ? (
            <Image
              src={m.src}
              alt={decorative ? "" : m.alt}
              fill
              sizes={sizes}
              quality={quality}
              placeholder={m.blurDataURL ? "blur" : "empty"}
              blurDataURL={m.blurDataURL ?? undefined}
              loading={eager && i === 0 ? "eager" : "lazy"}
              fetchPriority={priority && i === 0 ? "high" : undefined}
              className={styles.image}
              style={m.position ? { objectPosition: m.position, transformOrigin: m.position } : undefined}
            />
            ) : null}
          </div>
        );
      })}

      {controls && slides.length > 1 ? (
        <div className={styles.controls}>
          <span className={styles.counter} aria-live="off">
            {String(index + 1).padStart(2, "0")} <span aria-hidden="true">/</span> {String(slides.length).padStart(2, "0")}
          </span>
          <span className={styles.progress} aria-hidden="true">
            <span key={index} className={styles.bar} />
          </span>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            aria-label={userPaused ? "Reanudar las fotos" : "Pausar las fotos"}
          >
            {userPaused ? <IconPlay size={16} /> : <IconPause size={16} />}
          </button>
        </div>
      ) : null}
    </div>
  );
}
