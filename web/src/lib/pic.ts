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
};
