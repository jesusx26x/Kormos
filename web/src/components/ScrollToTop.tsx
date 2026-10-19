"use client";

import { useLayoutEffect } from "react";

// En la carga completa el navegador decide (restaura la posición al recargar)
let hardLoad = true;

/**
 * Al cambiar de marca (o volver a la portada) la vista empieza arriba.
 * Con Cache Components, Next.js conserva un instante la ruta anterior oculta
 * y su scroll automático cae una pantalla más abajo; por eso los enlaces
 * entre marcas usan scroll={false} y este componente lleva la vista arriba.
 */
export function ScrollToTop() {
  useLayoutEffect(() => {
    if (hardLoad) {
      hardLoad = false;
      return;
    }
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  return null;
}
