import { BRANDS, WHATSAPP_NUMBER, type BrandSlug } from "./brands";

/**
 * Enlace a WhatsApp con el mensaje ya escrito. Todos los mensajes empiezan
 * indicando la marca para poder clasificarlos en el chat.
 * Se mantiene por debajo de ~1,500 caracteres (límite práctico de wa.me).
 */
export function whatsappUrl(brand: BrandSlug | null, body?: string): string {
  const intro = brand ? BRANDS[brand].whatsappIntro : "Hola, escribo desde la web.";
  const text = body ? `${intro}\n${body}` : intro;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text.slice(0, 1500))}`;
}
