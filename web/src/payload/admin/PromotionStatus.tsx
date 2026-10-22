"use client";

import { useFormFields } from "@payloadcms/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./admin.module.css";

/** Cuántos cupones se han entregado, con el enlace a la lista de quienes los tienen. */
export function PromotionStatus() {
  const slots = useFormFields(([fields]) => Number(fields.slots?.value) || 0);
  const [given, setGiven] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/suscriptores?where[couponNumber][exists]=true&limit=1&depth=0", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setGiven(typeof d?.totalDocs === "number" ? d.totalDocs : null))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className={styles.notify} aria-label="Cupones entregados">
      <p className={styles.readyTitle}>Cupones entregados</p>
      <p className={styles.readyHint}>
        {given === null ? "Contando…" : `${given} de ${slots}. ${given >= slots ? "Ya no quedan cupos: el sitio muestra la promoción como agotada." : `Quedan ${slots - given}.`}`}
      </p>
      <Link href="/admin/collections/suscriptores?where[couponNumber][exists]=true" className={styles.readyHint}>
        Ver quién tiene cupón
      </Link>
    </section>
  );
}
