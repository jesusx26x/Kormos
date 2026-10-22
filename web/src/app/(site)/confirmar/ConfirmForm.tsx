"use client";

import { useActionState } from "react";
import { confirmSubscription, type TokenState } from "@/data/subscriptions";
import styles from "../not-found.module.css";

const INITIAL: TokenState = { status: "idle" };

export function ConfirmForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(confirmSubscription, INITIAL);

  if (state.status === "ok") {
    const c = state.coupon;
    return (
      <div role="status">
        {c ? (
          <p className={styles.text}>
            ¡Felicidades! Eres la persona {c.number} de {c.slots}: te enviamos por correo tu cupón de {c.percent} % de descuento. Tómale una captura y envíala por WhatsApp junto con tu pedido.
          </p>
        ) : null}
        <p className={styles.text}>¡Listo! Te avisaremos cuando haya piezas y proyectos nuevos. Cada correo trae un enlace para darte de baja cuando quieras.</p>
      </div>
    );
  }
  return (
    <form action={action} className={styles.unsubscribe}>
      <input type="hidden" name="token" value={token} />
      <p className={styles.text}>Recibirás los avisos de piezas y proyectos nuevos de Aracena Studio, Arpad Studio y Kormós.</p>
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Un momento…" : "Confirmar mi suscripción"}
      </button>
      {state.status === "error" ? (
        <p className={styles.text} role="alert">
          No pudimos confirmar con este enlace. Si te diste de baja, suscríbete otra vez desde el pie de cualquier página.
        </p>
      ) : null}
    </form>
  );
}
