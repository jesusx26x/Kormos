import type { CSSProperties } from "react";
import { LOGO_SIZES, type LogoKey } from "@/lib/logos.meta.generated";
import styles from "./Logo.module.css";

type LogoProps = {
  name: LogoKey;
  /** Texto accesible; si se omite, el logo es decorativo */
  title?: string;
  className?: string;
};

/**
 * Logo estático por máscara CSS sobre /brand/<nombre>.svg: hereda el color
 * (currentColor), el archivo se cachea y no añade trazados al HTML ni al JS.
 * Para el trazo animado usar <LogoAnimated> (solo servidor).
 */
export function Logo({ name, title, className }: LogoProps) {
  const [w, h] = LOGO_SIZES[name];
  const style = {
    "--logo-url": `url(/brand/${name}.svg)`,
    aspectRatio: `${w} / ${h}`,
  } as CSSProperties;

  return (
    <span
      className={[styles.mask, className].filter(Boolean).join(" ")}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    />
  );
}
