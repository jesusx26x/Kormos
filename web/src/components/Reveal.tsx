"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

// Un único IntersectionObserver compartido por todos los <Reveal>
let observer: IntersectionObserver | null = null;
const callbacks = new Map<Element, () => void>();

function observe(el: Element, onVisible: () => void) {
  if (!("IntersectionObserver" in window)) {
    onVisible();
    return () => {};
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
  );
  callbacks.set(el, onVisible);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

type RevealProps = {
  as?: ElementType;
  /** fade: sube y aparece · image: se descubre con clip-path */
  variant?: "fade" | "image";
  /** Retraso en ms para escalonar (40–60ms por elemento) */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>;

/**
 * Revela su contenido al entrar en pantalla, una sola vez. La clase
 * is-visible la controla React (estado), así no hay desajustes de
 * hidratación. Sin JS el contenido se ve igual (el estado oculto exige html.js).
 */
export function Reveal({ as: Tag = "div", variant = "fade", delay = 0, className, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return observe(ref.current, () => setVisible(true));
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={variant === "image" ? "image" : ""}
      className={[className, visible ? "is-visible" : ""].filter(Boolean).join(" ") || undefined}
      style={delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
