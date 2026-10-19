import type { LogoKey } from "./logos.meta.generated";
import type { MediaKey } from "./media.generated";

export type BrandSlug = "arpad" | "kormos" | "aracena";

export type NavItem = { label: string; href: string };

export type Brand = {
  slug: BrandSlug;
  name: string;
  /** Nombre corto en mayúsculas para la portada y los créditos */
  displayName: string;
  descriptor: string;
  /** Verbo del ecosistema: se visualiza · se ejecuta · se materializa */
  verb: string;
  founded: number;
  tagline: string;
  intro: string;
  monogram: LogoKey;
  wordmark?: LogoKey;
  /** Texto que acompaña al monograma cuando no hay wordmark vectorial de calidad */
  wordmarkText?: { name: string; sub: string };
  instagram: string;
  email?: string;
  /** Prefijo de cada mensaje de WhatsApp para saber de qué marca viene */
  whatsappIntro: string;
  ctaLabel: string;
  nav: NavItem[];
  /** Fotos del slideshow de la portada y del hero */
  heroMedia: MediaKey[];
};

/** Único WhatsApp para las tres marcas (decisión del 16-oct-2026) */
export const WHATSAPP_NUMBER = "18494722473";
export const WHATSAPP_DISPLAY = "849-472-2473";

/** Constante para no depender de la hora del servidor en el prerender */
export const COPYRIGHT_YEAR = 2026;

export const GROUP_TAGLINE = "Diseño que se visualiza, se ejecuta y se materializa.";

export const BRANDS: Record<BrandSlug, Brand> = {
  arpad: {
    slug: "arpad",
    name: "Arpad Studio",
    displayName: "ARPAD STUDIO",
    descriptor: "Arquitectura · Diseño · Construcción",
    verb: "Se ejecuta",
    founded: 2020,
    tagline: "Transformamos ideas en espacios con intención, estética y funcionalidad.",
    intro:
      "Somos un estudio de arquitectura dedicado al diseño y la ejecución de proyectos. Cada encargo es una oportunidad para diseñar experiencias que se sientan como hogar: espacios atemporales, materiales bien elegidos y una ejecución cuidada de principio a fin.",
    monogram: "arpadMonogram",
    wordmarkText: { name: "ARPAD STUDIO", sub: "Arquitectura | Diseño | Construcción" },
    instagram: "arpadstudio_",
    whatsappIntro: "Hola, escribo desde la web de ARPAD STUDIO.",
    ctaLabel: "Contactar",
    nav: [
      { label: "Proyectos", href: "/arpad/proyectos" },
      { label: "Servicios", href: "/arpad/servicios" },
      { label: "Proceso", href: "/arpad/proceso" },
      { label: "Estudio", href: "/arpad/estudio" },
    ],
    heroMedia: ["arpad-villa", "arpad-hall", "arpad-piscina", "arpad-fachada-noche"],
  },
  kormos: {
    slug: "kormos",
    name: "Kormós",
    displayName: "KORMÓS",
    descriptor: "Furniture Design · Atelier",
    verb: "Se materializa",
    founded: 2025,
    tagline: "More than furniture.",
    intro:
      "Kormós es un atelier de ebanistería donde la madera, el diseño y la arquitectura se encuentran para crear mobiliario con propósito. Diseñamos y fabricamos piezas a medida que equilibran funcionalidad, estética y precisión en cada detalle.",
    monogram: "kormosMonogram",
    wordmark: "kormosWordmark",
    instagram: "kormos.rd",
    email: "kormosfurniture@gmail.com",
    whatsappIntro: "Hola, escribo desde la web de KORMÓS.",
    ctaLabel: "Diseña tu pieza",
    nav: [
      { label: "Catálogo", href: "/kormos/catalogo" },
      { label: "Atelier", href: "/kormos/atelier" },
      { label: "Proyectos", href: "/kormos#proyectos" },
      { label: "Materiales", href: "/kormos#materiales" },
    ],
    heroMedia: ["kormos-interior-butacas", "kormos-bano", "kormos-dormitorio", "kormos-aparador"],
  },
  aracena: {
    slug: "aracena",
    name: "Aracena Studio",
    displayName: "ARACENA STUDIO",
    descriptor: "Rendering Projects",
    verb: "Se visualiza",
    founded: 2018,
    tagline: "Un buen render no solo muestra… transmite.",
    intro:
      "Somos un estudio de visualización arquitectónica especializado en renders hiperrealistas. Transformamos ideas en imágenes que comunican, venden y emocionan: exteriores, interiores, recorridos virtuales y material visual para ventas, redes o concursos.",
    monogram: "aracenaMonogram",
    wordmark: "aracenaWordmark",
    instagram: "aracenastudio_",
    whatsappIntro: "Hola, escribo desde la web de ARACENA STUDIO.",
    ctaLabel: "Solicitar render",
    nav: [
      { label: "Proyectos", href: "/aracena/proyectos" },
      { label: "Paquetes", href: "/aracena/paquetes" },
      { label: "Proceso", href: "/aracena/paquetes#proceso" },
    ],
    heroMedia: ["aracena-terraza-mar", "aracena-living", "aracena-habitacion", "aracena-bano"],
  },
};

/** Orden alfabético en la portada: ninguna marca encabeza visualmente */
export const BRAND_ORDER: BrandSlug[] = ["aracena", "arpad", "kormos"];

export function otherBrands(slug: BrandSlug): Brand[] {
  return BRAND_ORDER.filter((s) => s !== slug).map((s) => BRANDS[s]);
}
