// CONTENIDO INICIAL: lo usan scripts/seed.mts para la primera carga del panel y
// la migración del catálogo de Aracena. El sitio lee el contenido del panel.
import type { Paquete } from "@/payload-types";

type PackageData = Pick<Paquete, "name" | "includes" | "scale" | "priceAmount" | "priceTo" | "priceCurrency" | "showPrice" | "recommended">;

// Los paquetes de muestra de la primera carga: la migración del catálogo los
// reemplaza solo si siguen así
export const SAMPLE_PACKAGE_NAMES = ["Render interior", "Render exterior", "Recorrido virtual", "Material para ventas"] as const;

// Catálogo de paquetes de renders de Aracena Studio (2024)
export const RENDER_PACKAGES: PackageData[] = [
  {
    name: "Essential",
    scale: "Proyectos de 0 a 50 m²",
    includes: [
      "1 a 2 renders",
      "Uno o dos espacios interiores (por ejemplo, sala y dormitorio principal)",
      "Uno o dos exteriores",
      "Imágenes fijas en JPEG o PNG",
      "Una revisión para ajustes menores",
    ],
    priceAmount: 300,
    priceTo: 600,
    priceCurrency: "US$",
    showPrice: true,
    recommended: false,
  },
  {
    name: "Standard",
    scale: "Proyectos de 50 a 150 m²",
    includes: [
      "2 a 4 renders por área",
      "Todos los espacios interiores: sala, comedor, cocina, dormitorios y baños",
      "Fachadas y vista aérea",
      "Imágenes fijas y panorámica 360°",
      "Hasta dos revisiones para ajustes de diseño",
    ],
    priceAmount: 600,
    priceTo: 1500,
    priceCurrency: "US$",
    showPrice: true,
    recommended: false,
  },
  {
    name: "Premium",
    scale: "Proyectos de 150 a 400 m²",
    includes: [
      "6 a 8 renders",
      "Todos los espacios interiores: sala, comedor, cocina, dormitorios y más",
      "Iluminación y materiales realistas",
      "Imágenes fijas, panorámica 360° y recorridos virtuales avanzados",
      "Animaciones cortas, según el proyecto",
      "Varias revisiones y ajustes hasta lograr el resultado",
    ],
    priceAmount: 1500,
    priceTo: 2500,
    priceCurrency: "US$",
    showPrice: true,
    recommended: true,
  },
  {
    name: "Personalizado",
    scale: "Más de 400 m² o a la medida",
    includes: [
      "Renders según lo que necesita tu proyecto",
      "Cantidad de renders y revisiones a medida",
      "Se pueden añadir recorridos virtuales y vistas 360°",
      "Precio según los servicios y requisitos adicionales",
    ],
    priceAmount: 2500,
    priceTo: 4000,
    priceCurrency: "US$",
    showPrice: true,
    recommended: false,
  },
];

// Precios de renders sueltos por área, en dólares
export const AREA_PRICES = {
  exterior: [
    { area: "Fachadas", priceFrom: 150, priceTo: 1500 },
    { area: "Área de juegos", priceFrom: 150, priceTo: 500 },
    { area: "Jardín o patio", priceFrom: 200, priceTo: 450 },
    { area: "Terraza", priceFrom: 200, priceTo: 500 },
    { area: "Zona de piscina", priceFrom: 200, priceTo: 400 },
    { area: "Balcón", priceFrom: 100, priceTo: 350 },
  ],
  interior: [
    { area: "Sala de estar", priceFrom: 150, priceTo: 450 },
    { area: "Comedor", priceFrom: 150, priceTo: 450 },
    { area: "Cocina", priceFrom: 150, priceTo: 450 },
    { area: "Habitaciones", priceFrom: 150, priceTo: 450 },
    { area: "Baños", priceFrom: 100, priceTo: 350 },
    { area: "Estudio u oficina", priceFrom: 150, priceTo: 250 },
    { area: "Local comercial", priceFrom: 200, priceTo: 250 },
    { area: "Lavandería", priceFrom: 150, priceTo: 250 },
    { area: "Vestidores", priceFrom: 150, priceTo: 350 },
  ],
};

export const AREA_NOTE =
  "Precios de referencia en dólares. Varían según la complejidad del proyecto y lo que necesitas; envíanos tu solicitud y te respondemos con una cotización a tu medida. Ciertas restricciones aplican.";

const PRICE_FAQ_ANSWER =
  "Cada paquete y cada área muestran un precio de referencia. El precio final depende del tipo de proyecto, su escala y lo que necesitas comunicar: envíanos tu solicitud y te respondemos con una cotización.";

// Respuesta de la carga inicial, de cuando no se publicaban precios
export const PRICE_FAQ = {
  q: "¿Cuánto cuesta un render?",
  before:
    "No manejamos presupuestos genéricos. Cada propuesta se ajusta al tipo de proyecto, su escala y lo que necesitas comunicar. Envíanos tu solicitud y te respondemos con una cotización.",
  a: PRICE_FAQ_ANSWER,
};

// Respuestas tomadas de las políticas que Aracena publica en Instagram.
export const RENDER_FAQ = [
  {
    q: "¿Cuánto cuesta un render?",
    a: PRICE_FAQ_ANSWER,
  },
  {
    q: "¿Cotizan por mensaje directo en Instagram?",
    a: "Para evaluar bien cada proyecto, las solicitudes se gestionan por nuestros canales oficiales: WhatsApp y correo.",
  },
  {
    q: "¿Cómo se agenda un proyecto?",
    a: "Trabajamos con agendas y calendarios definidos. Programamos cada proyecto con antelación para cuidar los tiempos de entrega y el estándar de calidad.",
  },
  {
    q: "¿Cómo se inicia?",
    a: "Todo proyecto inicia con un anticipo. Con clientes nuevos firmamos una carta de compromiso que deja un marco claro y organizado para ambas partes.",
  },
  {
    q: "¿Trabajan con diseños de otros estudios?",
    a: "Sí. Recibimos proyectos de arquitectos, interioristas y constructoras, y los transformamos en renders que elevan la presentación y el impacto visual.",
  },
];
