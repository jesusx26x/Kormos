"use client";

import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

type PreloaderProps = {
  /** Monogramas animados (<LogoAnimated>), renderizados en el servidor */
  children: React.ReactNode;
  caption?: string;
};

/**
 * Velo de entrada con los monogramas dibujándose (~1.9 s). Solo en la portada
 * y en el inicio de cada marca, nunca en páginas interiores. Se ve una vez por sesión
 * (html[data-intro="visto"] lo oculta antes del primer pintado), se puede
 * saltar con un clic y nunca bloquea: al terminar queda invisible por CSS
 * aunque el evento de fin de animación no llegue.
 */
export function Preloader({ children, caption }: PreloaderProps) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("intro-visto", "1");
    } catch {}
  }, []);

  function finish() {
    document.documentElement.dataset.intro = "visto";
    setGone(true);
  }

  if (gone) return null;

  return (
    <div
      className={styles.preloader}
      aria-hidden="true"
      onClick={finish}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) finish();
      }}
    >
      <div className={styles.marks}>{children}</div>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </div>
  );
}
