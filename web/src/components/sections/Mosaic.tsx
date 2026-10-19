import Image from "next/image";
import { MEDIA, type MediaKey } from "@/lib/media.generated";
import { Reveal } from "../Reveal";
import styles from "./Sections.module.css";

export type MosaicItem = { media: MediaKey; title: string; meta?: string };

/**
 * Mosaico de fotos (patrón de Entre Dos Interiores): una pieza alta y una
 * cuadrícula. Cada foto se revela con clip-path al entrar en pantalla.
 */
export function Mosaic({ items }: { items: MosaicItem[] }) {
  return (
    <ul className={styles.mosaic}>
      {items.map((item, i) => {
        const m = MEDIA[item.media];
        return (
          <li key={item.media} className={styles.tile}>
            <figure className={styles.figure}>
              <Reveal variant="image" className={styles.tileMedia} delay={(i % 3) * 60}>
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes={i === 0 ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 50vw, 33vw"}
                  placeholder={m.blurDataURL ? "blur" : "empty"}
                  blurDataURL={m.blurDataURL ?? undefined}
                  className={styles.tileImage}
                />
              </Reveal>
              <figcaption className={styles.caption}>
                <span className={styles.captionTitle}>{item.title}</span>
                {item.meta ? <span className={styles.captionMeta}>{item.meta}</span> : null}
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
