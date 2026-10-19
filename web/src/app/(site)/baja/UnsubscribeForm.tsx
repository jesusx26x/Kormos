"use client";

import { useActionState } from "react";
import { unsubscribe, type TokenState } from "@/data/subscriptions";
import styles from "../not-found.module.css";

const INITIAL: TokenState = { status: "idle" };

export function UnsubscribeForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(unsubscribe, INITIAL);

  if (state.status === "ok") {
    return (
      <p className={styles.text} role="status">
        Listo. Ya no recibirás más correos de novedades. Si fue un error, puedes suscribirte otra vez desde el pie de cualquier página.
      </p>
    );
  }
  return (
    <form action={action} className={styles.unsubscribe}>
      <input type="hidden" name="token" value={token} />
      <p className={styles.text}>Dejarás de recibir los avisos de piezas y proyectos nuevos de Aracena Studio, Arpad Studio y Kormós.</p>
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Un momento…" : "Darme de baja"}
      </button>
      {state.status === "error" ? (
        <p className={styles.text} role="alert">
          No encontramos esta suscripción. Puede que ya te hayas dado de baja.
        </p>
      ) : null}
    </form>
  );
}
