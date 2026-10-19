"use client";

import { toast } from "@payloadcms/ui";
import type { DefaultCellComponentProps } from "payload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./admin.module.css";

const STATUS: Record<string, { label: string; tone: string }> = {
  disponible: { label: "Disponible", tone: "ok" },
  bajo_pedido: { label: "Bajo pedido", tone: "order" },
  proximamente: { label: "Próximamente", tone: "soon" },
  agotado: { label: "Agotado", tone: "out" },
};

/** Estado de la pieza como etiqueta de color. */
export function StatusCell({ cellData }: DefaultCellComponentProps) {
  const s = typeof cellData === "string" ? STATUS[cellData] : undefined;
  if (!s) return null;
  return (
    <span className={styles.pill} data-tone={s.tone}>
      {s.label}
    </span>
  );
}

/** "Visible en el sitio" como interruptor que se cambia desde la lista. */
export function VisibleCell({ cellData, rowData, collectionSlug }: DefaultCellComponentProps) {
  const router = useRouter();
  const [on, setOn] = useState(Boolean(cellData));
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !on;
    setBusy(true);
    setOn(next);
    try {
      const res = await fetch(`/api/${collectionSlug}/${rowData.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
      toast.success(next ? "Ahora se ve en el sitio." : "Oculta del sitio. No se borró nada.");
      router.refresh();
    } catch {
      setOn(!next);
      toast.error("No se pudo cambiar. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? "Visible en el sitio. Pulsa para ocultar" : "Oculta. Pulsa para mostrar en el sitio"}
      className={styles.switch}
      data-on={on}
      disabled={busy}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void toggle();
      }}
    >
      <span className={styles.switchTrack} aria-hidden="true">
        <span className={styles.switchThumb} />
      </span>
      <span className={styles.switchLabel}>{on ? "Visible" : "Oculta"}</span>
    </button>
  );
}
