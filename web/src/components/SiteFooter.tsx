import Link from "next/link";
import { COPYRIGHT_YEAR, WHATSAPP_DISPLAY, type Brand } from "@/lib/brands";
import { whatsappUrl } from "@/lib/whatsapp";
import { IconInstagram, IconMail, IconWhatsApp } from "./Icons";
import { Logo } from "./Logo";
import { getPromotion } from "@/data/promotion";
import { SubscribeForm } from "./SubscribeForm";
import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  brand: Brand;
  others: Brand[];
};

export async function SiteFooter({ brand, others }: SiteFooterProps) {
  // La promoción de lanzamiento es de Kormós: solo su pie la anuncia
  const promo = brand.slug === "kormos" ? await getPromotion() : null;
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.intro}>
          <Logo name={brand.monogram} title={brand.name} className={styles.mark} />
          <p className={`display ${styles.tagline}`}>{brand.tagline}</p>
          <a className={`btn ${styles.introCta}`} href={whatsappUrl(brand.slug)} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp size={16} /> Escríbenos
          </a>
        </div>

        <nav className={styles.col} aria-label="Pie de página">
          <p className="eyebrow">{brand.name}</p>
          <ul>
            {brand.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <p className="eyebrow">Grupo</p>
          <ul>
            {others.map((b) => (
              <li key={b.slug}>
                <Link href={`/${b.slug}`} scroll={false}>
                  {b.name}
                  <span className={styles.desc}>{b.descriptor}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/" scroll={false}>Portada</Link>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <p className="eyebrow">Contacto</p>
          <ul>
            <li>
              <a href={whatsappUrl(brand.slug)} target="_blank" rel="noopener noreferrer" className={styles.contact}>
                <IconWhatsApp size={16} /> {WHATSAPP_DISPLAY}
              </a>
            </li>
            {brand.email ? (
              <li>
                <a href={`mailto:${brand.email}`} className={styles.contact}>
                  <IconMail size={16} /> {brand.email}
                </a>
              </li>
            ) : null}
            <li>
              <a href={`https://www.instagram.com/${brand.instagram}/`} target="_blank" rel="noopener noreferrer" className={styles.contact}>
                <IconInstagram size={16} /> @{brand.instagram}
              </a>
            </li>
            <li className={styles.place}>República Dominicana</li>
          </ul>
        </div>

        <div className={styles.subscribeWrap}>
          <SubscribeForm
            brand={brand.slug}
            {...(promo?.remaining
              ? { label: `Suscríbete y recibe un cupón de ${promo.percent} %`, hint: `Para las primeras ${promo.slots} personas: quedan ${promo.remaining}. El cupón llega a tu correo al confirmar.` }
              : {})}
          />
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {COPYRIGHT_YEAR} {brand.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
