import Image from "next/image";
import Link from "next/link";
import type { BrandSlug } from "@/lib/brands";
import { MEDIA, type MediaKey } from "@/lib/media.generated";
import { waBlock, whatsappUrl } from "@/lib/whatsapp";
import { Reveal } from "../Reveal";
import styles from "./Sections.module.css";

export type PieceCategory = { media: MediaKey; name: string; pieces: string; note: string; href?: string };

/** Categorías de la Colección Origen con los recortes de producto del catálogo. */
export function CollectionGrid({ items }: { items: PieceCategory[] }) {
  return (
    <ul className={styles.collection}>
      {items.map((item, i) => {
        const m = MEDIA[item.media];
        return (
          <Reveal as="li" key={item.name} className={styles.piece} delay={(i % 3) * 60}>
            <div className={styles.pieceMedia}>
              <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="(max-width: 767px) 45vw, 22vw" className={styles.pieceImage} />
            </div>
            <h3 className={styles.pieceName}>{item.href ? <Link href={item.href} className={styles.pieceLink}>{item.name}</Link> : item.name}</h3>
            <p className={styles.pieceList}>{item.pieces}</p>
            <p className={styles.pieceNote}>{item.note}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}

export type RenderPackage = { name: string; includes: string[]; scale: string; price: string | null; recommended: boolean };

/** Paquetes de render de Aracena: precio según escala, solicitud por WhatsApp. */
export function PackageGrid({ slug, items }: { slug: BrandSlug; items: RenderPackage[] }) {
  return (
    // La retícula de 1px se dibuja con el fondo de la lista: se revela entera
    <Reveal as="ul" className={styles.packages}>
      {items.map((p, i) => (
        <li key={p.name} className={styles.package}>
          <span className={styles.number} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          {p.recommended ? <p className={styles.packageBadge}>Recomendado</p> : null}
          <h3 className={styles.packageName}>{p.name}</h3>
          {p.price ? <p className={styles.packageSize}>{p.scale}</p> : null}
          <ul className={styles.packageList}>
            {p.includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {/* Sin precio visible, el tamaño del proyecto ocupa su lugar */}
          <p className={styles.packageScale}>{p.price ?? p.scale}</p>
          <a
            className="link-arrow"
            href={whatsappUrl(slug, waBlock(`Paquete: ${p.name}`, p.price ? [["Precio de referencia", p.price]] : []), "Les comparto los datos de mi proyecto:\nTipo de proyecto:\nEscala:\nPlazo:")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar paquete
          </a>
        </li>
      ))}
    </Reveal>
  );
}

/** Imagen + texto a dos columnas (Atelier, estudio). */
export function Split({ media, children, reverse = false }: { media: MediaKey; children: React.ReactNode; reverse?: boolean }) {
  const m = MEDIA[media];
  return (
    <div className={`${styles.split} ${reverse ? styles.splitReverse : ""}`}>
      <Reveal variant="image" className={styles.splitMedia}>
        <Image src={m.src} alt={m.alt} fill sizes="(max-width: 899px) 100vw, 50vw" placeholder="blur" blurDataURL={m.blurDataURL ?? undefined} className={styles.tileImage} />
      </Reveal>
      <Reveal className={styles.splitBody}>
        {children}
      </Reveal>
    </div>
  );
}
