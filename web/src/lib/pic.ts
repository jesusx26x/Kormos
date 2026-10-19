import { MEDIA, type MediaKey } from "./media.generated";

/**
 * Datos serializables de una foto, venga del panel (Payload) o de las fotos
 * fijas del diseño (media.generated.ts). Seguro para componentes de cliente.
 */
export type Pic = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string | null;
  /** Recorte con fondo transparente: se muestra entero sobre fondo claro */
  cutout: boolean;
  /** Versión 1200×630 para compartir (Open Graph), si la foto es lo bastante grande */
  og?: string | null;
  /** Punto de enfoque marcado en el panel (CSS object-position): lo que no se recorta */
  position?: string | null;
};

/** Una foto fija del diseño (public/media) con la misma forma que las del panel. */
export function mediaPic(key: MediaKey): Pic {
  const m = MEDIA[key];
  return { src: m.src, alt: m.alt, width: m.width, height: m.height, blurDataURL: m.blurDataURL, cutout: false };
}
