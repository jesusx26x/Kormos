import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ConfirmForm } from "./ConfirmForm";
import styles from "../not-found.module.css";

export const metadata: Metadata = {
  title: "Confirmar la suscripción",
  robots: { index: false },
};

/** Confirmación de la suscripción a novedades. El enlace del correo trae el token personal. */
export default function Confirmar({ searchParams }: PageProps<"/confirmar">) {
  return (
    <main id="contenido" className={styles.page}>
      <p className={styles.code}>NOVEDADES</p>
      <h1 className={styles.title}>Confirma tu suscripción</h1>
      <Suspense fallback={<p className={styles.text}>Un momento…</p>}>
        <Token searchParams={searchParams} />
      </Suspense>
      <Link href="/" className={`link-arrow ${styles.home}`}>
        Ir a la portada
      </Link>
    </main>
  );
}

async function Token({ searchParams }: { searchParams: PageProps<"/confirmar">["searchParams"] }) {
  const t = (await searchParams).t;
  const token = typeof t === "string" ? t : "";
  return token ? (
    <ConfirmForm token={token} />
  ) : (
    <p className={styles.text}>Este enlace no está completo. Usa el botón «Confirmar mi suscripción» del correo que te enviamos.</p>
  );
}
