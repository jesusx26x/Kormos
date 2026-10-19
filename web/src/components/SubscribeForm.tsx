"use client";

import { useId, useState } from "react";
import styles from "./SiteFooter.module.css";

/**
 * Suscripción a novedades (Fase 7). Por ahora valida y confirma en pantalla;
 * el envío real se conecta cuando haya dominio y servicio de correo.
 */
export function SubscribeForm() {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "error" | "ok">("idle");

  return (
    <form
      className={styles.subscribe}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
        setStatus(input.checkValidity() && input.value ? "ok" : "error");
      }}
    >
      <label htmlFor={`${id}-email`} className={styles.subscribeLabel}>
        Recibe las novedades del grupo
      </label>
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
          onChange={() => status !== "idle" && setStatus("idle")}
        />
        <button type="submit" className={styles.subscribeButton}>
          Suscribirme
        </button>
      </div>
      <p id={`${id}-status`} className={styles.subscribeStatus} role="status" aria-live="polite" data-status={status}>
        {status === "error" && "Escribe un correo válido, por ejemplo nombre@correo.com."}
        {status === "ok" && "¡Gracias! La suscripción se activará cuando el sitio esté publicado."}
      </p>
    </form>
  );
}
