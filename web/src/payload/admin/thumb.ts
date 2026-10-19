/** Miniatura servida por el optimizador de Next (ancho de images.imageSizes y calidad de images.qualities en next.config.ts). */
export function thumb(url: string, width: 48 | 64 | 96 | 128 | 256) {
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=75`;
}
