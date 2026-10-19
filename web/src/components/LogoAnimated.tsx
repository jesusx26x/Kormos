import type { CSSProperties } from "react";
import { LOGOS } from "@/lib/logos.generated";
import type { LogoKey } from "@/lib/logos.meta.generated";
import styles from "./Logo.module.css";

type LogoAnimatedProps = {
  name: LogoKey;
  title?: string;
  /** Animación de trazo → relleno (como el monograma de Entre Dos) */
  draw?: boolean;
  /** Retraso de la animación en ms */
  delay?: number;
  className?: string;
};

/** SVG en línea (componente de servidor): necesario para animar el trazo. */
export function LogoAnimated({ name, title, draw = true, delay = 0, className }: LogoAnimatedProps) {
  const { viewBox, d } = LOGOS[name];
  const [, , w, h] = viewBox.split(" ").map(Number);
  const style = {
    "--logo-stroke": Math.max(w, h) / 170,
    "--logo-delay": `${delay}ms`,
  } as CSSProperties;

  return (
    <svg
      viewBox={viewBox}
      className={[styles.svg, draw ? styles.draw : "", className].filter(Boolean).join(" ")}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={d} pathLength={1} fillRule="evenodd" />
    </svg>
  );
}
