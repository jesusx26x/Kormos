"use client";

import { useActionState, useId, useState } from "react";
import { subscribe, type SubscribeState } from "@/data/subscriptions";
import type { BrandSlug } from "@/lib/brands";
import styles from "./SiteFooter.module.css";

const INITIAL: SubscribeState = { status: "idle", message: "" };

/** Suscripción a novedades: guarda el correo en el panel (Suscriptores). */
export function SubscribeForm({ brand }: { brand: BrandSlug }) {
  const id = useId();
  const [state, action, pending] = useActionState(subscribe, INITIAL);
  // Error del navegador antes de enviar (correo vacío o mal escrito)
  const [localError, setLocalError] = useState(false);
  const status = localError ? "error" : state.status;
  const message = localError ? "Escribe un correo válido, por ejemplo nombre@correo.com." : state.message;

  return (
    <form
      className={styles.subscribe}
      noValidate
      action={action}
      onSubmit={(e) => {
        const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
        if (!input.checkValidity() || !input.value) {
          e.preventDefault();
          setLocalError(true);
        }
      }}
    >
      <label htmlFor={`${id}-email`} className={styles.subscribeLabel}>
        Recibe las novedades del grupo
      </label>
      <input type="hidden" name="brand" value={brand} />
      {/* Campo trampa para robots: oculto a personas y a lectores de pantalla */}
      <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.trap} />
      <div className={styles.subscribeRow}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="tu@correo.com"
          required
          aria-invalid={status === "error" || undefined}
          aria-describedby={`${id}-status`}
          className={styles.subscribeInput}
          onChange={() => localError && setLocalError(false)}
        />
        <button type="submit" className={styles.subscribeButton} disabled={pending}>
          {pending ? "Enviando…" : "Suscribirme"}
        </button>
      </div>
      <p id={`${id}-status`} className={styles.subscribeStatus} role="status" aria-live="polite" data-status={status}>
        {status === "idle" ? "Solo para avisarte de piezas y proyectos nuevos. Te das de baja cuando quieras." : message}
      </p>
    </form>
  );
}
