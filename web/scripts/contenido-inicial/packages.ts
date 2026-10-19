// CONTENIDO INICIAL: solo lo usa scripts/seed.mts para la primera carga del panel.
// El sitio ya no lee este archivo: el contenido se edita en /admin.
import type { RenderPackage } from "@/components/sections/Cards";

// Paquetes de Aracena Studio. Sin precios aún: el estudio no maneja
// presupuestos genéricos. Cuando haya precios se añade { price, currency }.
export const RENDER_PACKAGES: RenderPackage[] = [
  {
    name: "Render interior",
    includes: ["Imágenes hiperrealistas por ambiente", "Iluminación y materiales a detalle", "Encuadres pensados para comunicar el diseño"],
    scale: "Precio según número de ambientes",
  },
  {
    name: "Render exterior",
    includes: ["Fachadas y volumetría", "Vistas de día y de noche", "Paisajismo y entorno"],
    scale: "Precio según escala del proyecto",
  },
  {
    name: "Recorrido virtual",
    includes: ["Animación del proyecto", "Ideal para preventas", "Formato para redes y presentaciones"],
    scale: "Precio según duración",
  },
  {
    name: "Material para ventas",
    includes: ["Piezas para redes y brochures", "Imágenes para concursos", "Antes y después"],
    scale: "Precio según volumen",
  },
];

// Respuestas tomadas de las políticas que Aracena publica en Instagram.
export const RENDER_FAQ = [
  {
    q: "¿Cuánto cuesta un render?",
    a: "No manejamos presupuestos genéricos. Cada propuesta se ajusta al tipo de proyecto, su escala y lo que necesitas comunicar. Envíanos tu solicitud y te respondemos con una cotización.",
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
