// CONTENIDO INICIAL: solo lo usa scripts/seed.mts para la primera carga del panel.
// El sitio ya no lee este archivo: el contenido se edita en /admin.
import type { BrandSlug } from "@/lib/brands";
import type { MediaKey } from "@/lib/media.generated";

// Proyectos de muestra tomados de las publicaciones de Instagram.
// Los nombres son descriptivos (las publicaciones no los traen) y se
// reemplazan por los reales cuando el cliente entregue sus carpetas.

export type ProjectCategory = "Residencial" | "Comercial" | "Remodelación" | "Interiorismo" | "Exterior" | "Interior";

export type Credit = { role: string; name: string; href?: string };

export type BeforeAfter = { before: MediaKey; after: MediaKey; label: string };

export type Project = {
  brand: BrandSlug;
  slug: string;
  title: string;
  summary: string;
  description: string[];
  categories: ProjectCategory[];
  location?: string;
  services: string[];
  cover: MediaKey;
  gallery: MediaKey[];
  beforeAfter?: BeforeAfter[];
  credits: Credit[];
  source: string;
};

const ARPAD = { role: "Diseño y ejecución", name: "Arpad Studio", href: "/arpad" };
const ARACENA = { role: "Renders", name: "Aracena Studio", href: "/aracena" };

export const PROJECTS: Project[] = [
  // ---------------- Arpad Studio ----------------
  {
    brand: "arpad",
    slug: "fachada-reinterpretada",
    title: "Fachada reinterpretada",
    summary: "No es cambiar la arquitectura, sino reinterpretarla: líneas claras y luz que resalta los volúmenes, de día y de noche.",
    description: [
      "A veces no hace falta cambiar la arquitectura, sino reinterpretarla. Definimos líneas más claras, resaltamos los volúmenes y usamos la iluminación como un elemento arquitectónico más.",
      "El resultado es un proyecto más definido, contemporáneo y coherente, donde cada detalle cumple una función estética y espacial.",
    ],
    categories: ["Remodelación", "Residencial"],
    services: ["Remodelación", "Diseño de fachada", "Iluminación"],
    cover: "arpad-fachada-noche",
    gallery: ["arpad-fachada-noche"],
    beforeAfter: [{ before: "arpad-fachada-noche-antes", after: "arpad-fachada-noche", label: "Fachada" }],
    credits: [ARPAD, ARACENA],
    source: "https://www.instagram.com/p/DUlMNNQkTdS/",
  },
  {
    brand: "arpad",
    slug: "de-tradicional-a-contemporaneo",
    title: "De tradicional a contemporáneo",
    summary: "Un frente sencillo convertido en una obra moderna, con líneas limpias y materiales de vanguardia.",
    description: [
      "Transformamos esta fachada de lo tradicional a lo contemporáneo. A través del diseño digital, convertimos un frente sencillo en una obra moderna con líneas limpias y materiales de vanguardia.",
      "La propuesta incluye la marquesina y el garaje, con un pavimento ajardinado y una cubierta en madera con iluminación lineal.",
    ],
    categories: ["Remodelación", "Residencial"],
    services: ["Diseño digital", "Remodelación"],
    cover: "arpad-fachada-despues",
    gallery: ["arpad-fachada-despues", "arpad-garaje-despues"],
    beforeAfter: [
      { before: "arpad-fachada-antes", after: "arpad-fachada-despues", label: "Fachada" },
      { before: "arpad-garaje-antes", after: "arpad-garaje-despues", label: "Marquesina y garaje" },
    ],
    credits: [{ role: "Diseño digital", name: "Arpad Studio", href: "/arpad" }, ARACENA],
    source: "https://www.instagram.com/p/C_s7ZzypeRH/",
  },
  {
    brand: "arpad",
    slug: "residencia-luz-y-naturaleza",
    title: "Residencia luz y naturaleza",
    summary: "Arquitectura que respira luz, modernidad y naturaleza.",
    description: [
      "Una residencia contemporánea donde la madera, el vidrio y la vegetación conviven en equilibrio. Volúmenes limpios, terrazas abiertas y una fachada que se ilumina con calidez.",
      "En Arpad Studio creemos en diseñar hogares que inspiran y elevan cada día.",
    ],
    categories: ["Residencial"],
    services: ["Diseño arquitectónico"],
    cover: "arpad-villa",
    gallery: ["arpad-villa"],
    credits: [{ role: "Diseño de proyecto", name: "Arpad Studio", href: "/arpad" }, ARACENA],
    source: "https://www.instagram.com/p/DPUN7fMCZ3k/",
  },
  {
    brand: "arpad",
    slug: "villa-elegancia-contemporanea",
    title: "Villa elegancia contemporánea",
    summary: "Una villa donde cada línea, textura y reflejo está pensado para enmarcar la perfección.",
    description: [
      "Arquitectura que redefine la elegancia contemporánea. Vistas abiertas, integración con la naturaleza y una presencia que impone sin esfuerzo.",
      "Un diseño creado para quienes buscan más que una casa: un estilo de vida.",
    ],
    categories: ["Residencial"],
    services: ["Diseño arquitectónico"],
    cover: "arpad-villa-2",
    gallery: ["arpad-villa-2"],
    credits: [{ role: "Diseño de proyecto", name: "Arpad Studio", href: "/arpad" }, ARACENA],
    source: "https://www.instagram.com/p/DPPerkHj7PQ/",
  },
  {
    brand: "arpad",
    slug: "area-social-con-piscina",
    title: "Área social con piscina",
    summary: "Líneas limpias, materiales cálidos y vegetación tropical que enmarca el espacio.",
    description: [
      "Área social con piscina integrada, donde predominan las líneas limpias, los materiales cálidos y la vegetación tropical que enmarca el espacio.",
      "El muro de piedra natural aporta textura y privacidad, mientras que la iluminación lineal y los revestimientos de madera acentúan la sensación de confort.",
    ],
    categories: ["Residencial", "Exterior"],
    services: ["Diseño exterior", "Paisajismo"],
    cover: "arpad-piscina",
    gallery: ["arpad-piscina", "arpad-piscina-2"],
    credits: [ARPAD, ARACENA],
    source: "https://www.instagram.com/p/DQEcMU7EctA/",
  },
  {
    brand: "arpad",
    slug: "hall-donde-el-diseno-habla",
    title: "Un hall donde el diseño habla",
    summary: "Diseño que se visualiza, se ejecuta y se materializa: el trabajo de las tres marcas en un mismo espacio.",
    description: [
      "Un hall pensado para recibir, conectar y transmitir desde el primer momento la esencia del proyecto. Cada elemento busca el equilibrio entre funcionalidad, materialidad y estética.",
      "La arquitectura interior se complementa con piezas diseñadas y fabricadas a medida, creando un espacio con identidad propia.",
    ],
    categories: ["Interiorismo"],
    services: ["Interiorismo", "Ejecución", "Mobiliario a medida"],
    cover: "arpad-hall",
    gallery: ["arpad-hall"],
    credits: [
      { role: "Ejecución", name: "Arpad Studio", href: "/arpad" },
      ARACENA,
      { role: "Mobiliario, panelados y credenza", name: "Kormós", href: "/kormos" },
    ],
    source: "https://www.instagram.com/p/DcyvemlSoKv/",
  },
  {
    brand: "arpad",
    slug: "tienda-e-design",
    title: "Tienda en E-Design",
    summary: "Un espacio comercial diseñado completamente de manera digital, sin importar la distancia.",
    description: [
      "Este proyecto de tienda, diseñado completamente de manera digital, muestra cómo transformamos espacios de forma creativa y funcional con nuestro servicio de E-Design.",
      "Exhibición a lo largo de los muros, un banco central con jardinera y una paleta clara con acentos en azul.",
    ],
    categories: ["Comercial", "Interiorismo"],
    services: ["E-Design", "Interiorismo comercial"],
    cover: "arpad-tienda",
    gallery: ["arpad-tienda", "arpad-tienda-2", "arpad-tienda-3", "arpad-tienda-4"],
    credits: [{ role: "Diseño digital", name: "Arpad Studio", href: "/arpad" }, ARACENA],
    source: "https://www.instagram.com/p/C_lU384pv2W/",
  },
  {
    brand: "arpad",
    slug: "jardin-interior",
    title: "Jardín interior bajo mezzanine",
    summary: "La luz natural desciende desde el segundo nivel y baña un jardín interior.",
    description: [
      "Un espacio que respira frescura: la luz natural desciende desde el segundo nivel con mezzanine y baña el jardín interior, creando un ambiente donde diseño y naturaleza se integran.",
    ],
    categories: ["Residencial", "Interiorismo"],
    services: ["Diseño arquitectónico", "Interiorismo"],
    cover: "aracena-jardin",
    gallery: ["aracena-jardin"],
    credits: [{ role: "Diseño", name: "Arpad Studio", href: "/arpad" }, ARACENA],
    source: "https://www.instagram.com/p/DNk7nB8tgh1/",
  },

  // ---------------- Aracena Studio ----------------
  {
    brand: "aracena",
    slug: "terraza-frente-al-mar",
    title: "Terraza frente al mar",
    location: "Las Terrenas, Samaná",
    summary: "Cada textura y cada entrada de luz dialogan con el entorno natural.",
    description: [
      "Este render nace de la visión de transformar una idea en una experiencia habitable. Cada textura, cada entrada de luz y cada integración con el paisaje dialoga con el entorno de Las Terrenas.",
      "A través de la visualización arquitectónica anticipamos emociones y damos vida a los sueños de nuestros clientes antes de colocar el primer bloque.",
    ],
    categories: ["Exterior"],
    services: ["Render exterior"],
    cover: "aracena-terraza-mar",
    gallery: ["aracena-terraza-mar"],
    credits: [{ role: "Renders", name: "Aracena Studio" }],
    source: "https://www.instagram.com/p/DU22odIlsi-/",
  },
  {
    brand: "aracena",
    slug: "living-geometrico",
    title: "Living geométrico",
    summary: "Texturas cálidas, formas audaces y una atmósfera que respira calma.",
    description: ["Diseño donde la geometría cobra vida y el confort se vuelve arte. Cada detalle está pensado para inspirar."],
    categories: ["Interior"],
    services: ["Render interior"],
    cover: "aracena-living",
    gallery: ["aracena-living"],
    credits: [{ role: "Diseño", name: "Amanda Musa ID" }, { role: "Renders", name: "Aracena Studio" }],
    source: "https://www.instagram.com/p/DOyVKEOEUL6/",
  },
  {
    brand: "aracena",
    slug: "habitacion-principal",
    title: "Habitación principal",
    summary: "Capturar la esencia de una propuesta y llevarla a una imagen a la altura de su diseño.",
    description: ["Un render para Amanda Musa ID en el que buscamos capturar la esencia de su propuesta y llevarla a una representación a la altura de su diseño."],
    categories: ["Interior"],
    services: ["Render interior"],
    cover: "aracena-habitacion",
    gallery: ["aracena-habitacion"],
    credits: [{ role: "Diseño", name: "Amanda Musa ID" }, { role: "Renders", name: "Aracena Studio" }],
    source: "https://www.instagram.com/p/Dc_tNQUSWMQ/",
  },
  {
    brand: "aracena",
    slug: "bano-marmol-y-madera",
    title: "Baño en mármol y madera",
    summary: "Un baño pensado desde la armonía de sus materiales y la calidez de sus texturas.",
    description: [
      "Nuestro trabajo fue llevar esta propuesta a una imagen que transmitiera la intención del diseño y le diera vida a cada elemento.",
      "Un buen render no solo muestra un espacio: también transmite lo que se siente al habitarlo.",
    ],
    categories: ["Interior"],
    services: ["Render interior"],
    cover: "aracena-bano",
    gallery: ["aracena-bano"],
    credits: [{ role: "Diseño", name: "Amanda Musa ID" }, { role: "Renders", name: "Aracena Studio" }],
    source: "https://www.instagram.com/p/DdBpKyQSvov/",
  },
  {
    brand: "aracena",
    slug: "living-punta-cana",
    title: "Living en Punta Cana",
    location: "Punta Cana",
    summary: "Estética contemporánea, realismo visual y una visión clara del resultado final.",
    description: ["Renders hiperrealistas que transmiten la esencia arquitectónica con un toque sofisticado y elegante, para una experiencia inmersiva que refleja la exclusividad del diseño."],
    categories: ["Interior"],
    services: ["Render interior"],
    cover: "aracena-living-2",
    gallery: ["aracena-living-2"],
    credits: [{ role: "Diseño", name: "Xenarch Studio" }, { role: "Renders", name: "Aracena Studio" }],
    source: "https://www.instagram.com/p/DO6KdvsEYjq/",
  },
  {
    brand: "aracena",
    slug: "habitacion-caribena",
    title: "Habitación caribeña",
    location: "Punta Cana",
    summary: "Toques tenues, brisa costera e inspiración caribeña.",
    description: ["Una habitación que evoca la calma de Punta Cana. Cada elemento fue pensado para transmitir ligereza, frescura y descanso."],
    categories: ["Interior"],
    services: ["Render interior"],
    cover: "aracena-habitacion-2",
    gallery: ["aracena-habitacion-2"],
    credits: [{ role: "Propuesta de diseño", name: "Xenarch Studio" }, { role: "Renders", name: "Aracena Studio" }],
    source: "https://www.instagram.com/p/DLID175xaML/",
  },
  {
    brand: "aracena",
    slug: "villa-contemporanea",
    title: "Villa contemporánea",
    summary: "Vistas abiertas, integración con la naturaleza y una presencia que impone sin esfuerzo.",
    description: ["Una villa donde cada línea, textura y reflejo está pensado para enmarcar la perfección. Renders para un proyecto de Arpad Studio."],
    categories: ["Exterior"],
    services: ["Render exterior"],
    cover: "arpad-villa-2",
    gallery: ["arpad-villa-2", "arpad-villa"],
    credits: [{ role: "Diseño de proyecto", name: "Arpad Studio", href: "/arpad" }, { role: "Renders", name: "Aracena Studio" }],
    source: "https://www.instagram.com/p/DPPerkHj7PQ/",
  },
  {
    brand: "aracena",
    slug: "fachada-residencial",
    title: "Fachada residencial",
    summary: "Volumetría, materiales y luz cálida para una fachada con carácter.",
    description: ["Un buen diseño merece un render a su altura: volúmenes definidos, materiales cálidos y una iluminación que resalta la arquitectura."],
    categories: ["Exterior"],
    services: ["Render exterior"],
    cover: "aracena-fachada",
    gallery: ["aracena-fachada"],
    credits: [{ role: "Renders", name: "Aracena Studio" }],
    source: "https://www.instagram.com/p/DKqVOPvMrXr/",
  },
  {
    brand: "aracena",
    slug: "hall-de-entrada",
    title: "Hall de entrada",
    summary: "Diseño que se visualiza, se ejecuta y se materializa.",
    description: ["Un hall con credenza y panelados a medida: render de Aracena Studio, ejecución de Arpad Studio y mobiliario de Kormós."],
    categories: ["Interior"],
    services: ["Render interior"],
    cover: "arpad-hall",
    gallery: ["arpad-hall"],
    credits: [
      { role: "Renders", name: "Aracena Studio" },
      { role: "Ejecución", name: "Arpad Studio", href: "/arpad" },
      { role: "Mobiliario", name: "Kormós", href: "/kormos" },
    ],
    source: "https://www.instagram.com/p/DcyvemlSoKv/",
  },
];
