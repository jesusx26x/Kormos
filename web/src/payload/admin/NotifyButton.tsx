"use client";

import { ConfirmationModal, toast, useDocumentInfo, useField, useFormFields, useFormModified, useModal } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { formatDateTime } from "./dates";

const MODAL = "avisar-suscriptores";

/** Botón "Avisar a los suscriptores" de la ficha (pieza o proyecto). */
export function NotifyButton() {
  const { id, collectionSlug } = useDocumentInfo();
  const { value: notifiedAt } = useField<string | null>({ path: "notifiedAt" });
  const published = useFormFields(([fields]) => fields.published?.value !== false);
  const modified = useFormModified();
  const router = useRouter();
  const { openModal } = useModal();
  const [count, setCount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/suscriptores?where[status][equals]=activo&limit=1&depth=0", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setCount(typeof d?.totalDocs === "number" ? d.totalDocs : null))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!id) return null;

  async function send() {
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/${collectionSlug}/${id}/avisar`, { method: "POST", credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) toast.success(data.message ?? "Aviso enviado.");
      else toast.error(data.message ?? "No se pudo enviar el aviso.");
      router.refresh();
    } catch {
      toast.error("No se pudo enviar el aviso. Revisa la conexión e inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  const blocked = !published ? "Márcala como visible y guarda para poder avisar." : modified ? "Guarda los cambios antes de avisar." : null;

  return (
    <section className={styles.notify} aria-label="Avisar a los suscriptores">
      <p className={styles.readyTitle}>Avisar a los suscriptores</p>
      {notifiedAt ? (
        <p className={styles.readyHint}>Ya se avisó el {formatDateTime(notifiedAt)}.</p>
      ) : (
        <>
          <p className={styles.readyHint}>
            Manda un correo con la foto y el enlace a {count === null ? "los suscriptores" : count === 1 ? "1 suscriptor" : `${count} suscriptores`}. Se envía una sola vez.
          </p>
          <button type="button" className={styles.notifyButton} disabled={sending || Boolean(blocked) || count === 0} onClick={() => openModal(MODAL)}>
            {sending ? "Enviando…" : "Avisar ahora"}
          </button>
          {blocked ? <p className={styles.readyHint}>{blocked}</p> : null}
          <ConfirmationModal
            modalSlug={MODAL}
            heading="¿Avisar a los suscriptores?"
            body={`Se enviará un correo con esta ficha a ${count === null ? "todos los suscriptores activos" : count === 1 ? "1 suscriptor activo" : `${count} suscriptores activos`}. Se envía una sola vez y no se puede deshacer.`}
            cancelLabel="Todavía no"
            confirmLabel="Sí, enviar ahora"
            confirmingLabel="Enviando…"
            onConfirm={send}
          />
        </>
      )}
    </section>
  );
}
