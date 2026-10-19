import Image from "next/image";
import type { BrandSlug } from "@/lib/brands";
import type { MediaKey } from "@/lib/media.generated";
import { img } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";
import { IconWhatsApp } from "../Icons";
import styles from "./Sections.module.css";

export type Service = {
  title: string;
  text: string;
  includes: string[];
  idealFor: string;
  media: MediaKey;
};

/** Contenido de una pestaña de servicio (se renderiza en el servidor). */
export function ServicePanel({ brand, service }: { brand: BrandSlug; service: Service }) {
  const m = img(service.media);
  return (
    <article className={styles.service}>
      <div className={styles.serviceMedia}>
        <Image src={m.src} alt={m.alt} fill sizes="(max-width: 959px) 100vw, 45vw" placeholder={m.blurDataURL ? "blur" : "empty"} blurDataURL={m.blurDataURL ?? undefined} className={styles.tileImage} />
      </div>
      <div className={styles.serviceBody}>
        <h2 className={`display ${styles.serviceTitle}`}>{service.title}</h2>
        <p className={styles.serviceText}>{service.text}</p>
        <div>
          <p className="eyebrow">Incluye</p>
          <ul className={styles.serviceList}>
            {service.includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <p className={styles.serviceIdeal}>
          <span className="eyebrow">Ideal para</span> {service.idealFor}
        </p>
        <a className="btn" href={whatsappUrl(brand, `Quiero cotizar el servicio de ${service.title}.`)} target="_blank" rel="noopener noreferrer">
          <IconWhatsApp size={16} /> Cotizar {service.title.toLowerCase()}
        </a>
      </div>
    </article>
  );
}
