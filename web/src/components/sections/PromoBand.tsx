import { getPromotion } from "@/data/promotion";
import { Reveal } from "../Reveal";
import { SubscribeForm } from "../SubscribeForm";
import styles from "./Sections.module.css";

/** Promoción de lanzamiento con los cupos que quedan. Sin promoción activa o sin cupos, no aparece. */
export async function PromoBand() {
  const promo = await getPromotion();
  if (!promo?.remaining) return null;
  return (
    <section id="promocion" className={`section ${styles.promo}`} aria-labelledby="promocion-titulo">
      <div className={`container ${styles.promoGrid}`}>
        <Reveal className={styles.promoHead}>
          <p className="eyebrow">Promoción de lanzamiento</p>
          <h2 id="promocion-titulo" className={styles.promoTitle}>
            <span className={`display ${styles.promoPercent}`}>{promo.percent} %</span>
            <span className={styles.promoOff}>de descuento</span>
          </h2>
          <p className={styles.promoText}>
            Para las primeras {promo.slots} personas que se suscriban en nuestra web. El cupón te llega por correo al confirmar tu suscripción.
          </p>
        </Reveal>
        <Reveal className={styles.promoAside} delay={80}>
          <div className={styles.promoSlots}>
            <ol className={styles.promoDots} aria-hidden="true">
              {Array.from({ length: promo.slots }, (_, i) => (
                <li key={i} data-taken={i < promo.given || undefined} />
              ))}
            </ol>
            <p>
              Quedan <strong>{promo.remaining}</strong> de {promo.slots} cupos
            </p>
          </div>
          <SubscribeForm brand="kormos" label="Reserva tu cupón" hint="Escribe tu correo y confirma desde el mensaje que te enviamos." />
          {promo.terms ? <p className={styles.promoTerms}>{promo.terms}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
