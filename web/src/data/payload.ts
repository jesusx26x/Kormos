import "server-only";
import config from "@payload-config";
import { getPayload } from "payload";
import type { Pic } from "@/lib/pic";
import type { Foto } from "@/payload-types";

/** Cliente local de Payload (misma base de datos, sin pasar por HTTP). */
export const cms = () => getPayload({ config });

type Rel<T> = number | T | null | undefined;

/** Una relación ya resuelta (depth ≥ 1) o nada. */
export function doc<T extends object>(value: Rel<T>): T | null {
  return value && typeof value === "object" ? value : null;
}

export function docs<T extends object>(values: Rel<T>[] | null | undefined): T[] {
  return (values ?? []).map(doc).filter((v): v is T => v !== null);
}

export function pic(value: Rel<Foto>): Pic | null {
  const f = doc(value);
  if (!f?.url) return null;
  return {
    src: f.url,
    alt: f.alt,
    width: f.width ?? 1200,
    height: f.height ?? 800,
    blurDataURL: f.blurDataURL ?? null,
    cutout: !!f.cutout,
    // La versión en la URL hace que WhatsApp y las redes no reutilicen una foto reemplazada
    og: `/compartir/${f.id}?v=${Date.parse(f.updatedAt) || 0}`,
  };
}

export function pics(values: Rel<Foto>[] | null | undefined): Pic[] {
  return (values ?? []).map(pic).filter((v): v is Pic => v !== null);
}

/** Texto con líneas en blanco entre párrafos → lista de párrafos. */
export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/**
 * Next exige que generateStaticParams devuelva al menos una ruta. Con la base
 * todavía vacía (primer despliegue) se usa una ficha inexistente, que da 404.
 */
export function atLeastOne(params: { slug: string }[]): { slug: string }[] {
  return params.length ? params : [{ slug: "sin-contenido" }];
}
