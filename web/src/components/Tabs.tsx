"use client";

import { useId, useRef, useState } from "react";
import styles from "./Tabs.module.css";

export type TabItem = { label: string; content: React.ReactNode };

/**
 * Pestañas accesibles (patrón WAI-ARIA): flechas, Inicio y Fin mueven el foco
 * y activan la pestaña. El cambio de panel no se anima cuando viene del
 * teclado (Emil Kowalski: nunca animar acciones de teclado).
 */
export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const [fromKeyboard, setFromKeyboard] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  function select(i: number, keyboard: boolean) {
    setFromKeyboard(keyboard);
    setActive(i);
    if (keyboard) refs.current[i]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const last = items.length - 1;
    const map: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  }

  return (
    <div className={styles.tabs}>
      <div role="tablist" aria-label={label} className={styles.list} onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <button
            key={item.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${base}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => select(i, false)}
          >
            <span className={styles.num} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.label}
          id={`${base}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className={styles.panel}
          data-instant={fromKeyboard || undefined}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
