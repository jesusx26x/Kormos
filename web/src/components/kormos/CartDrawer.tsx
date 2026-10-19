"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cart, cartDrawer, useCart, useCartDrawer } from "@/lib/cart";
import { whatsappUrl } from "@/lib/whatsapp";
import { IconClose, IconMinus, IconPlus, IconWhatsApp } from "../Icons";
import type { CartProductInfo } from "./catalogData";
import styles from "./Kormos.module.css";

/**
 * Cajón lateral "Mi selección" sobre <dialog> nativo (foco atrapado, Escape
 * cierra, el foco vuelve al botón que lo abrió). Entra desde la derecha con
 * transform y sale un poco más rápido de lo que entra.
 */
export function CartDrawer({ products }: { products: CartProductInfo[] }) {
  const open = useCartDrawer();
  const items = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const [closing, setClosing] = useState(false);
  const id = useId();
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const lines = items
    .map((i) => {
      const p = bySlug.get(i.slug);
      if (!p) return null;
      const variant = p.variants.find((v) => v.id === i.variantId);
      return { ...i, p, variant };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      opener.current = document.activeElement;
      setClosing(false);
      el.showModal();
    } else if (!open && el.open) {
      // Animación de salida y luego se cierra de verdad
      setClosing(true);
      const t = window.setTimeout(() => {
        el.close();
        setClosing(false);
      }, 260);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      cartDrawer.set(false);
    };
    const onClose = () => {
      cartDrawer.set(false);
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("close", onClose);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("close", onClose);
    };
  }, []);

  function quoteUrl(form: HTMLFormElement | null) {
    const data = form ? new FormData(form) : null;
    const nombre = String(data?.get("nombre") ?? "").trim();
    const nota = String(data?.get("nota") ?? "").trim();
    // El enlace de cada pieza: WhatsApp muestra la foto del primero y el
    // estudio identifica cada pieza sin buscarla en el sitio
    const list = lines.map(
      (l, n) =>
        [
          `${n + 1}. ${l.p.name}`,
          l.variant ? `${l.p.variantLabel}: ${l.variant.name}` : null,
          l.p.dims,
          `x${l.qty}`,
          l.p.code,
        ]
          .filter(Boolean)
          .join(" — ") + `\n${window.location.origin}/kormos/catalogo/${l.p.slug}`,
    );
    return whatsappUrl(
      "kormos",
      ["Me gustaría cotizar estas piezas:", ...list, nombre ? `\nNombre: ${nombre}` : "", nota ? `Nota: ${nota}` : ""].filter(Boolean).join("\n"),
    );
  }

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <dialog
      ref={dialog}
      className={styles.drawer}
      data-closing={closing || undefined}
      aria-labelledby={`${id}-title`}
      onClick={(e) => {
        if (e.target === e.currentTarget) cartDrawer.set(false);
      }}
    >
      <div className={styles.drawerPanel}>
        <header className={styles.drawerHead}>
          <h2 id={`${id}-title`} className={styles.drawerTitle}>
            Mi selección {count ? <span>({count})</span> : null}
          </h2>
          <button type="button" className={styles.iconButton} onClick={() => cartDrawer.set(false)} aria-label="Cerrar mi selección">
            <IconClose size={22} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className={styles.drawerEmpty}>
            <p>Aún no has agregado piezas.</p>
            <p className={styles.muted}>Explora la Colección Origen y arma tu selección para cotizarla por WhatsApp.</p>
            <Link href="/kormos/catalogo" className="btn" onClick={() => cartDrawer.set(false)}>
              Ver el catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.lines}>
              {lines.map((l) => (
                <li key={`${l.slug}-${l.variantId ?? ""}`} className={styles.line}>
                  <Link href={`/kormos/catalogo/${l.slug}`} className={styles.lineMedia} onClick={() => cartDrawer.set(false)} tabIndex={-1} aria-hidden="true">
                    <Image src={l.p.image.src} alt="" fill sizes="88px" className={l.p.image.cutout ? styles.contain : styles.cover} />
                  </Link>
                  <div className={styles.lineBody}>
                    <Link href={`/kormos/catalogo/${l.slug}`} className={styles.lineName} onClick={() => cartDrawer.set(false)}>
                      {l.p.name}
                    </Link>
                    <p className={styles.lineMeta}>
                      {l.variant ? `${l.p.variantLabel}: ${l.variant.name} · ` : ""}
                      {l.p.code}
                    </p>
                    <p className={styles.linePrice}>{l.p.price}</p>
                    <div className={styles.lineActions}>
                      <div className={styles.stepper} role="group" aria-label={`Cantidad de ${l.p.name}`}>
                        <button type="button" onClick={() => cart.setQty(l.slug, l.variantId, l.qty - 1)} aria-label="Quitar una">
                          <IconMinus size={16} />
                        </button>
                        <output aria-live="polite">{l.qty}</output>
                        <button type="button" onClick={() => cart.setQty(l.slug, l.variantId, l.qty + 1)} aria-label="Agregar una">
                          <IconPlus size={16} />
                        </button>
                      </div>
                      <button type="button" className={styles.remove} onClick={() => cart.remove(l.slug, l.variantId)}>
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <form ref={formRef} className={styles.drawerFoot} onSubmit={(e) => e.preventDefault()}>
              {/* Plegado: en pantallas bajas deja espacio a la lista */}
              <details className={styles.extras}>
                <summary>Agregar nombre o nota (opcional)</summary>
                <div className={styles.drawerFields}>
                  <label>
                    <span>Tu nombre</span>
                    <input name="nombre" type="text" autoComplete="name" />
                  </label>
                  <label>
                    <span>Nota</span>
                    <textarea name="nota" rows={2} placeholder="Medidas, acabados, fecha deseada…" />
                  </label>
                </div>
              </details>
              <a
                className="btn"
                href={quoteUrl(null)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Toma el nombre y la nota escritos en este momento
                  e.currentTarget.href = quoteUrl(formRef.current);
                }}
              >
                <IconWhatsApp size={16} /> Solicitar cotización
              </a>
              <p className={styles.muted}>Se abrirá WhatsApp con tu selección ya escrita. Sin pagos en línea: te respondemos con la cotización.</p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
