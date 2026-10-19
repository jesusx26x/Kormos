"use client";

import { cartDrawer, useCartCount } from "@/lib/cart";
import { IconBag } from "../Icons";
import styles from "./Kormos.module.css";

/** Icono de "Mi selección" en la cabecera de Kormós, con contador. */
export function CartButton() {
  const count = useCartCount();
  return (
    <button
      type="button"
      className={styles.cartButton}
      onClick={() => cartDrawer.set(true)}
      aria-label={count ? `Mi selección: ${count} ${count === 1 ? "pieza" : "piezas"}` : "Mi selección (vacía)"}
      aria-haspopup="dialog"
    >
      <IconBag size={22} />
      {count ? (
        // key: al cambiar el número, la insignia hace un pequeño "pulso"
        <span key={count} className={styles.cartCount} aria-hidden="true">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
