import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { UnsubscribeForm } from "./UnsubscribeForm";
import styles from "../not-found.module.css";

export const metadata: Metadata = {
  title: "Dejar de recibir novedades",
  robots: { index: false },
};

/** Baja de las novedades por correo. El enlace de cada correo trae el token personal. */
export default function Baja({ searchParams }: PageProps<"/baja">) {
  return (
    <main id="contenido" className={styles.page}>
      <p className={styles.code}>NOVEDADES</p>
      <h1 className={styles.title}>¿Dejar de recibir nuestras novedades?</h1>
      <Suspense fallback={<p className={styles.text}>Un momento…</p>}>
        <Token searchParams={searchParams} />
      </Suspense>
      <Link href="/" className={`link-arrow ${styles.home}`}>
        Volver a la portada
      </Link>
    </main>
  );
}

async function Token({ searchParams }: { searchParams: PageProps<"/baja">["searchParams"] }) {
  const t = (await searchParams).t;
  const token = typeof t === "string" ? t : "";
  return token ? (
    <UnsubscribeForm token={token} />
  ) : (
    <p className={styles.text}>Este enlace no está completo. Usa el enlace «Darme de baja» que aparece al final de cualquiera de nuestros correos.</p>
  );
}
