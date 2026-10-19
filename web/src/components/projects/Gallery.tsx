"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconArrow, IconClose } from "../Icons";
import styles from "./Projects.module.css";

type Img = { src: string; alt: string; width: number; height: number; blurDataURL: string | null };

/**
 * Galería del proyecto con visor a pantalla completa sobre <dialog> nativo:
 * Escape cierra, las flechas navegan y el foco vuelve a la miniatura.
 */
export function Gallery({ images, title }: { images: Img[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };

  const close = useCallback(() => dialog.current?.close(), []);

  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => {
      setIndex((i) => {
        if (i !== null) triggers.current[i]?.focus();
        return null;
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    el.addEventListener("close", onClose);
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("close", onClose);
      el.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const current = index === null ? null : images[index];

  return (
    <>
      <ul className={styles.gallery} data-count={images.length}>
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              ref={(el) => {
                triggers.current[i] = el;
              }}
              type="button"
              className={styles.galleryButton}
              onClick={() => open(i)}
              aria-label={`Ver en grande: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes={images.length === 1 ? "(max-width: 899px) 100vw, 1200px" : "(max-width: 767px) 100vw, 50vw"}
                placeholder={img.blurDataURL ? "blur" : "empty"}
                blurDataURL={img.blurDataURL ?? undefined}
                className={styles.galleryImage}
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label={`Galería: ${title}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current ? (
          <div className={styles.lightboxInner}>
            <div className={styles.lightboxStage}>
              <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" quality={85} className={styles.lightboxImage} />
            </div>
            <p className={styles.lightboxCaption}>
              {current.alt}
              {images.length > 1 ? (
                <span>
                  {" "}
                  · {(index ?? 0) + 1} / {images.length}
                </span>
              ) : null}
            </p>
            {images.length > 1 ? (
              <>
                <button type="button" className={`${styles.lightboxNav} ${styles.prev}`} onClick={() => step(-1)} aria-label="Foto anterior">
                  <IconArrow size={22} />
                </button>
                <button type="button" className={`${styles.lightboxNav} ${styles.next}`} onClick={() => step(1)} aria-label="Foto siguiente">
                  <IconArrow size={22} />
                </button>
              </>
            ) : null}
            <button type="button" className={styles.lightboxClose} onClick={close} aria-label="Cerrar la galería" autoFocus>
              <IconClose size={22} />
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
