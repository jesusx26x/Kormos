"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useId, useRef, useState, ViewTransition } from "react";
import { cart } from "@/lib/cart";
import { IconBag, IconCheck } from "../Icons";
import type { ProductCardInfo } from "./catalogData";
import styles from "./Kormos.module.css";

type Category = { slug: string; name: string };

const STORAGE_KEY = "catalogo-filtro";

// sessionStorage puede estar bloqueado (modo privado, políticas del navegador): el filtro es un extra, no un requisito
const recall = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};
const remember = (slug: string) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, slug);
  } catch {}
};

/**
 * Catálogo con filtro por categoría. La categoría se refleja en el hash
 * (#ottomanes) para poder compartir el enlace sin depender de searchParams.
 */
export function CatalogGrid({ products, categories, filters = true }: { products: ProductCardInfo[]; categories: Category[]; filters?: boolean }) {
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    if (!filters) return;
    const read = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      setFilter(categories.some((c) => c.slug === hash) ? hash : "todos");
    };
    // Al volver desde una pieza el enlace "Catálogo" llega sin hash: se recupera la última categoría elegida
    const restore = () => {
      const saved = recall();
      if (!window.location.hash && saved && saved !== "todos" && categories.some((c) => c.slug === saved)) {
        setFilter(saved);
        window.history.replaceState(window.history.state, "", `${window.location.pathname}#${saved}`);
      } else {
        read();
      }
    };
    restore();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [categories, filters]);

  function choose(slug: string) {
    startTransition(() => setFilter(slug));
    remember(slug);
    const url = slug === "todos" ? window.location.pathname : `${window.location.pathname}#${slug}`;
    window.history.replaceState(window.history.state, "", url);
  }

  const visible = filter === "todos" ? products : products.filter((p) => p.categorySlug === filter);

  return (
    <div>
      {filters ? (
      <div className={styles.filters}>
        <div className={styles.filterRow} role="group" aria-label="Filtrar por categoría">
          {[{ slug: "todos", name: "Todo" }, ...categories].map((c) => (
            <button key={c.slug} type="button" className={styles.filter} aria-pressed={filter === c.slug} onClick={() => choose(c.slug)}>
              {c.name}
            </button>
          ))}
        </div>
        <p className={styles.count} role="status" aria-live="polite">
          {visible.length} {visible.length === 1 ? "pieza" : "piezas"}
        </p>
      </div>
      ) : null}

      <ul className={styles.catalog}>
        {visible.map((p) => (
          <ViewTransition key={p.slug} name={`pieza-${p.slug}`}>
            <li className={styles.card}>
              <Link href={p.href} className={styles.cardLink}>
                <span className={styles.cardMedia} data-cutout={p.image.cutout || undefined}>
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    fill
                    sizes="(max-width: 767px) 50vw, (max-width: 1099px) 33vw, 25vw"
                    placeholder={p.image.blurDataURL ? "blur" : "empty"}
                    blurDataURL={p.image.blurDataURL ?? undefined}
                    className={p.image.cutout ? styles.contain : styles.cover}
                  />
                  {/* Casi todo se fabrica bajo pedido: la etiqueta solo marca las excepciones */}
                  {p.status !== "bajo_pedido" ? (
                    <span className={styles.badge} data-status={p.status}>
                      {p.statusLabel}
                    </span>
                  ) : null}
                </span>
                <span className={styles.cardCat}>{p.category}</span>
                <span className={styles.cardName}>{p.name}</span>
                <span className={styles.cardFoot}>
                  <span className={styles.cardPrice}>{p.price}</span>
                  <span className={styles.dots} aria-label={`${p.swatches.length} acabados`}>
                    {p.swatches.slice(0, 4).map((s) => (
                      <span key={s.name} className={styles.dot} style={s.src ? { backgroundImage: `url(${s.src})` } : { background: s.hex }} title={s.name} />
                    ))}
                    {p.swatches.length > 4 ? <span className={styles.more}>+{p.swatches.length - 4}</span> : null}
                  </span>
                </span>
              </Link>
              <QuickAdd product={p} />
            </li>
          </ViewTransition>
        ))}
      </ul>
    </div>
  );
}

/**
 * Agregar sin abrir la ficha. Todas las piezas tienen acabados: "Agregar"
 * despliega sus muestras y se agrega la elegida, igual que desde la ficha.
 */
function QuickAdd({ product: p }: { product: ProductCardInfo }) {
  const [choosing, setChoosing] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const listId = useId();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function add(variantId: string | undefined, name: string | null) {
    cart.add(p.slug, variantId);
    setChoosing(false);
    setAdded(name ?? p.name);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(null), 1800);
  }

  return (
    <div className={styles.quickAdd}>
      <button
        type="button"
        className={`btn btn--ghost ${styles.cardAction}`}
        aria-label={p.swatches.length ? `Agregar ${p.name} a mi selección: elegir ${p.variantLabel.toLowerCase()}` : `Agregar ${p.name} a mi selección`}
        aria-expanded={p.swatches.length ? choosing : undefined}
        aria-controls={p.swatches.length ? listId : undefined}
        onClick={() => (p.swatches.length ? setChoosing((c) => !c) : add(undefined, null))}
      >
        {added ? <IconCheck size={14} /> : <IconBag size={14} />}
        <span>{added ? "Agregada" : "Agregar"}</span>
      </button>
      <span className="visually-hidden" aria-live="polite">
        {added ? `${p.name}${added !== p.name ? `, ${added}` : ""}: agregada a mi selección` : ""}
      </span>
      {p.swatches.length && choosing ? (
        <div id={listId} className={styles.quickList} role="group" aria-label={`Elige ${p.variantLabel.toLowerCase()}`}>
          <p className={styles.quickTitle}>{p.variantLabel}</p>
          {p.swatches.map((s) => (
            <button key={s.id} type="button" className={styles.quickOption} onClick={() => add(s.id, s.name)}>
              <span className={styles.dot} style={s.src ? { backgroundImage: `url(${s.src})` } : { background: s.hex }} aria-hidden="true" />
              {s.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
