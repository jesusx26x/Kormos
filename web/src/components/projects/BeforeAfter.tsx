"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties } from "react";
import styles from "./Projects.module.css";

type Img = { src: string; alt: string; blurDataURL: string | null };

/**
 * Comparador antes/después con clip-path (GPU, sin capas extra; técnica de
 * Emil Kowalski). El control es un <input type="range"> nativo que cubre la
 * imagen: se arrastra con el dedo o el ratón y se mueve con las flechas del
 * teclado, así que no depende solo del gesto de arrastre (WCAG 2.5.7).
 */
export function BeforeAfter({ before, after, label }: { before: Img; after: Img; label: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <figure className={styles.compare}>
      <div className={styles.compareStage} style={{ "--pos": `${pos}%` } as CSSProperties}>
        <Image src={before.src} alt={before.alt} fill sizes="(max-width: 899px) 100vw, 80vw" className={styles.compareImage} placeholder={before.blurDataURL ? "blur" : "empty"} blurDataURL={before.blurDataURL ?? undefined} />
        <div className={styles.compareAfter} aria-hidden="true">
          <Image src={after.src} alt="" fill sizes="(max-width: 899px) 100vw, 80vw" className={styles.compareImage} />
        </div>
        <span className={`${styles.compareTag} ${styles.tagBefore}`} aria-hidden="true">
          Antes
        </span>
        <span className={`${styles.compareTag} ${styles.tagAfter}`} aria-hidden="true">
          Después
        </span>
        <span className={styles.compareHandle} aria-hidden="true">
          <span className={styles.compareKnob} />
        </span>
        <label htmlFor={id} className="visually-hidden">
          {`Comparar antes y después: ${label}. Mueve a la izquierda para ver el después.`}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className={styles.compareRange}
          aria-valuetext={`${100 - pos}% después visible`}
        />
      </div>
      <figcaption className={styles.compareCaption}>{label}</figcaption>
    </figure>
  );
}
