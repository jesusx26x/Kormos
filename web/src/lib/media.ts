import { MEDIA, type MediaKey } from "./media.generated";

/** Datos serializables de una foto para pasarlos a componentes de cliente. */
export function img(key: MediaKey) {
  const m = MEDIA[key];
  if (!m) throw new Error(`Foto no encontrada en media.generated.ts: "${key}"`);
  return { src: m.src, alt: m.alt, width: m.width, height: m.height, blurDataURL: m.blurDataURL as string | null };
}
