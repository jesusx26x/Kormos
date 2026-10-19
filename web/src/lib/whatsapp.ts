import { BRANDS, WHATSAPP_NUMBER, type BrandSlug } from "./brands";

type Paragraph = string | null | undefined | false;
type Field = readonly [label: string, value: string | number | null | undefined | false];

/** wa.me deja de abrir el chat con textos muy largos */
const MAX_LENGTH = 1500;

/** Un valor en una sola línea y sin espacios dobles: un salto dentro de una nota desordena el mensaje. */
const oneLine = (value: string | number) => String(value).replace(/\s+/g, " ").trim();

/**
 * Un bloque del mensaje: título en negrita (formato de WhatsApp) y una línea
 * "Etiqueta: valor" por dato. Los datos vacíos se omiten, y si no queda
 * ninguno el bloque entero desaparece (sin un "Mis datos" vacío). Sin datos
 * desde el principio, queda solo el título.
 */
export function waBlock(title: string | null, fields: Field[]): string {
  const lines = fields
    .filter(([, value]) => value !== null && value !== undefined && value !== false && oneLine(value) !== "")
    .map(([label, value]) => `${label}: ${oneLine(value as string | number)}`);
  if (fields.length && !lines.length) return "";
  return [title ? `*${title}*` : null, ...lines].filter(Boolean).join("\n");
}

/**
 * Texto completo: saludo con la marca (para clasificar los chats) y cada
 * párrafo separado por una línea en blanco, sin espacios sobrantes.
 */
export function whatsappText(brand: BrandSlug | null, ...paragraphs: Paragraph[]): string {
  const intro = brand ? `Hola, escribo desde la web de ${BRANDS[brand].name}.` : "Hola, escribo desde la web.";
  return [intro, ...paragraphs]
    .filter((p): p is string => typeof p === "string" && p.trim() !== "")
    .map((p) =>
      p
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
    )
    .join("\n\n");
}

/** Recorta entre dos bloques (o, si no hay, entre dos líneas): nunca a mitad de una pieza. */
function fit(text: string): string {
  if (text.length <= MAX_LENGTH) return text;
  const limit = MAX_LENGTH - 3;
  const block = text.lastIndexOf("\n\n", limit);
  const cut = block > 0 ? block : text.lastIndexOf("\n", limit);
  return `${text.slice(0, cut > 0 ? cut : limit).trimEnd()}\n\n…`;
}

/** Enlace a WhatsApp con el mensaje ya escrito y ordenado. */
export function whatsappUrl(brand: BrandSlug | null, ...paragraphs: Paragraph[]): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fit(whatsappText(brand, ...paragraphs)))}`;
}

export { MAX_LENGTH as WHATSAPP_MAX_LENGTH };
