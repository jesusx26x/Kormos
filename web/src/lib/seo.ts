import type { Metadata } from "next";
import { BRANDS, WHATSAPP_NUMBER, type Brand, type BrandSlug } from "./brands";

/**
 * URL pública del sitio. Mientras no haya dominio se usa localhost; al
 * publicar basta con definir NEXT_PUBLIC_SITE_URL (p. ej. https://kormos.com.do).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Aracena Studio · Arpad Studio · Kormós";

/** Fecha de la última actualización de contenido (constante: no depende del reloj al prerenderizar). */
export const CONTENT_UPDATED = "2026-10-16";

type PageMetaInput = {
  title: string;
  description: string;
  /** Ruta de la página, p. ej. "/kormos/catalogo" */
  path: string;
  /** Imagen para compartir (1200×630 idealmente); relativa al sitio */
  image?: string;
  brand?: BrandSlug;
  type?: "website" | "article";
};

/**
 * Metadatos completos de una página: título, descripción, canonical y
 * Open Graph (lo que WhatsApp, Facebook o LinkedIn muestran al compartir).
 */
export function pageMeta({ title, description, path, image, brand, type = "website" }: PageMetaInput): Metadata {
  const ogImage = image ?? (brand ? `/og/og-${brand}.jpg` : "/og/og-portada.jpg");
  const siteName = brand ? BRANDS[brand].name : SITE_NAME;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      locale: "es_DO",
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

/** Datos estructurados de cada marca (schema.org) */
export function brandJsonLd(b: Brand) {
  const slug = b.slug;
  const type = slug === "kormos" ? "FurnitureStore" : "ProfessionalService";
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${SITE_URL}/${slug}#negocio`,
    name: b.name,
    description: b.intro,
    slogan: b.tagline,
    url: `${SITE_URL}/${slug}`,
    logo: `${SITE_URL}/brand/${b.monogram}.svg`,
    image: `${SITE_URL}/og/og-${slug}.jpg`,
    foundingDate: String(b.founded),
    telephone: `+${WHATSAPP_NUMBER}`,
    ...(b.email ? { email: b.email } : {}),
    address: { "@type": "PostalAddress", addressCountry: "DO" },
    areaServed: { "@type": "Country", name: "República Dominicana" },
    sameAs: [`https://www.instagram.com/${b.instagram}/`],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
}
