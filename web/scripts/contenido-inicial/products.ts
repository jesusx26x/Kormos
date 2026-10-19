// CONTENIDO INICIAL: solo lo usa scripts/seed.mts para la primera carga del panel.
// El sitio ya no lee este archivo: el contenido se edita en /admin.
import type { MediaKey } from "@/lib/media.generated";

// Catálogo de Kormós — "Colección Origen" (catálogo Canva) + piezas a medida de Instagram.
// Descripciones tomadas del catálogo de Kormós. PENDIENTE DEL CLIENTE: medidas reales,
// precios, archivos .skp/.dwg/.pdf y fotos por acabado. Mientras no haya foto de un
// acabado, la ficha muestra la foto de referencia y la muestra del material.

export type ProductStatus = "disponible" | "bajo_pedido" | "proximamente" | "agotado";
export type Currency = "RD$" | "US$";

export const STATUS_LABEL: Record<ProductStatus, string> = {
  disponible: "Disponible",
  bajo_pedido: "Bajo pedido",
  proximamente: "Próximamente",
  agotado: "Agotado",
};

export type CategorySlug = "ottomanes" | "mesas-auxiliares" | "mesas-de-noche" | "mesas-de-centro" | "espejos" | "cuadros" | "a-medida";

export const CATEGORIES: { slug: CategorySlug; name: string; singular: string }[] = [
  { slug: "ottomanes", name: "Ottomanes", singular: "Ottoman" },
  { slug: "mesas-auxiliares", name: "Mesas auxiliares", singular: "Mesa auxiliar" },
  { slug: "mesas-de-noche", name: "Mesas de noche", singular: "Mesa de noche" },
  { slug: "mesas-de-centro", name: "Mesas de centro", singular: "Mesa de centro" },
  { slug: "espejos", name: "Marcos para espejo", singular: "Marco para espejo" },
  { slug: "cuadros", name: "Cuadros de madera", singular: "Cuadro de madera" },
  { slug: "a-medida", name: "Piezas a medida", singular: "Pieza a medida" },
];

export type Variant = {
  id: string;
  name: string;
  /** Muestra: textura del catálogo o color plano */
  swatch: { media?: MediaKey; hex?: string };
  /** Fotos de la pieza en este acabado (si no hay, se usa la foto de referencia) */
  images?: MediaKey[];
};

export type Product = {
  slug: string;
  code: string;
  name: string;
  category: CategorySlug;
  collection: "Colección Origen" | "A medida";
  summary: string;
  description: string[];
  materials: { label: string; value: string }[];
  /** Medidas en cm (alto × ancho × profundidad) */
  dimensions?: { alto: number; ancho: number; fondo: number };
  dimensionsNote: string;
  price?: { amount: number; currency: Currency };
  showPrice: boolean;
  status: ProductStatus;
  images: MediaKey[];
  variantLabel: string;
  variants: Variant[];
  files: { skp?: string; dwg?: string; pdf?: string };
  featured?: boolean;
};

// ---- Acabados reutilizables ----
const W = (id: string, name: string, media: MediaKey): Variant => ({ id, name, swatch: { media } });
const MADERAS: Variant[] = [
  W("nogal", "Nogal", "mat-nogal"),
  W("roble", "Roble", "mat-roble"),
  W("teka", "Teka", "mat-teka"),
  W("caoba", "Caoba", "mat-caoba"),
  W("cedro", "Cedro", "mat-cedro"),
  W("pino", "Pino tratado", "mat-pino"),
];
const TELAS: Variant[] = [
  W("lino", "Lino blanco", "tela-lino"),
  W("crema", "Crema", "tela-crema"),
  W("boucle-gris", "Bouclé gris", "tela-boucle-gris"),
  W("olivo", "Verde olivo", "tela-olivo"),
];

const BAJO_PEDIDO = { status: "bajo_pedido" as const, showPrice: false, files: {} };
const MEDIDAS_ESTANDAR = "Medidas estándar. También se fabrica a la medida de tu espacio.";
const MEDIDAS_A_ELEGIR = "Medidas a elegir según tu espacio.";

const ottoman = (p: Pick<Product, "slug" | "code" | "name" | "summary" | "description" | "images"> & Partial<Product>): Product => ({
  category: "ottomanes",
  collection: "Colección Origen",
  materials: [
    { label: "Estructura", value: "Madera de pino" },
    { label: "Tapizado", value: "Selección de telas" },
    { label: "Fabricación", value: "Bajo pedido" },
  ],
  dimensionsNote: MEDIDAS_ESTANDAR,
  variantLabel: "Tapizado",
  variants: TELAS,
  ...BAJO_PEDIDO,
  ...p,
});

const madera = (
  category: CategorySlug,
  p: Pick<Product, "slug" | "code" | "name" | "summary" | "description" | "images"> & Partial<Product>,
): Product => ({
  category,
  collection: "Colección Origen",
  materials: [
    { label: "Madera", value: "A elección" },
    { label: "Color de madera", value: "A elección" },
    { label: "Fabricación", value: "Bajo pedido" },
  ],
  dimensionsNote: category === "mesas-de-noche" || category === "mesas-auxiliares" ? MEDIDAS_ESTANDAR : MEDIDAS_A_ELEGIR,
  variantLabel: "Madera",
  variants: MADERAS,
  ...BAJO_PEDIDO,
  ...p,
});

export const PRODUCTS: Product[] = [
  // ---------------- Ottomanes ----------------
  ottoman({
    slug: "ottoman-bruma",
    code: "KR-OT-01",
    name: "Ottoman Bruma",
    summary: "Versatilidad y carácter: asiento auxiliar o elemento decorativo.",
    description: [
      "Pieza contemporánea diseñada para aportar versatilidad y carácter al espacio.",
      "Su estructura en madera de pino y su acabado tapizado permiten integrarlo con facilidad en distintos ambientes, funcionando como asiento auxiliar o elemento decorativo.",
    ],
    images: ["kormos-pieza-ottoman"],
    featured: true,
  }),
  ottoman({
    slug: "ottoman-trama",
    code: "KR-OT-02",
    name: "Ottoman Trama",
    summary: "Una presencia sutil pero definida, inspirada en la relación entre materia y estructura.",
    description: [
      "Inspirado en la relación entre materia y estructura, este ottoman ofrece una presencia sutil pero definida.",
      "Ideal para complementar espacios con una estética limpia y cuidadosamente pensada.",
    ],
    images: ["kormos-ottoman-trama"],
  }),
  ottoman({
    slug: "ottoman-nordico",
    code: "KR-OT-03",
    name: "Ottoman Nórdico",
    summary: "Lenguaje minimalista, proporciones simples y una lectura siempre elegante.",
    description: [
      "De lenguaje minimalista, esta pieza resalta por sus proporciones y simplicidad.",
      "Diseñada para adaptarse a diferentes ambientes, manteniendo siempre una lectura elegante y contemporánea.",
    ],
    images: ["kormos-ottoman-nordico"],
    // Precio que figura en el catálogo Canva: confirmar con Kormós
    price: { amount: 120, currency: "US$" },
    showPrice: true,
    featured: true,
  }),
  ottoman({
    slug: "ottoman-arlo",
    code: "KR-OT-04",
    name: "Ottoman Arlo",
    summary: "Líneas suaves y proporciones equilibradas, con comodidad y ligereza visual.",
    description: [
      "Pieza contemporánea de líneas suaves y proporciones equilibradas, pensada para integrarse con naturalidad en distintos espacios.",
      "Su diseño aporta comodidad y carácter sin perder ligereza visual.",
    ],
    images: ["kormos-ottoman-arlo"],
  }),
  ottoman({
    slug: "ottoman-nodo",
    code: "KR-OT-05",
    name: "Ottoman Nodo",
    summary: "Equilibrio entre forma y función en un diseño compacto.",
    description: [
      "Pieza contemporánea que destaca por su equilibrio entre forma y función.",
      "Su diseño compacto permite integrarlo con facilidad en distintos espacios, aportando carácter y versatilidad como asiento auxiliar o elemento decorativo.",
    ],
    images: ["kormos-ottoman-nodo"],
  }),

  // ---------------- Mesas auxiliares ----------------
  madera("mesas-auxiliares", {
    slug: "mesa-auxiliar-ela",
    code: "KR-AX-01",
    name: "Mesa auxiliar Ela",
    summary: "Versátil y atemporal: simplicidad, armonía y calidez.",
    description: [
      "Versátil y atemporal, se adapta a distintos usos dentro del espacio.",
      "Su diseño prioriza la simplicidad y la armonía, aportando calidez a través de sus materiales.",
    ],
    images: ["kormos-aux-01"],
    featured: true,
  }),
  madera("mesas-auxiliares", {
    slug: "mesa-auxiliar-02",
    code: "KR-AX-02",
    name: "Mesa auxiliar 02",
    summary: "Proporciones firmes y una presencia sutil.",
    description: [
      "Con un carácter más definido, destaca por sus proporciones firmes y su presencia sutil.",
      "Ideal para complementar espacios que buscan equilibrio entre funcionalidad y diseño.",
    ],
    images: ["kormos-pieza-auxiliar"],
  }),
  madera("mesas-auxiliares", {
    slug: "mesa-auxiliar-03",
    code: "KR-AX-03",
    name: "Mesa auxiliar 03",
    summary: "Ligera en apariencia y funcional en su uso.",
    description: [
      "Ligera en apariencia y funcional en su uso, acompaña el espacio sin sobrecargarlo.",
      "Su diseño limpio permite que se adapte fácilmente a diferentes estilos y ambientes.",
    ],
    images: ["kormos-aux-03"],
  }),
  madera("mesas-auxiliares", {
    slug: "mesa-auxiliar-04",
    code: "KR-AX-04",
    name: "Mesa auxiliar 04",
    summary: "Presencia cálida que resalta la belleza del material.",
    description: [
      "De presencia cálida y proporciones equilibradas, está pensada para integrarse con naturalidad en distintos espacios.",
      "Su diseño resalta la belleza del material y aporta un toque sutil de carácter.",
    ],
    images: ["kormos-aux-04"],
  }),

  // ---------------- Mesas de noche ----------------
  madera("mesas-de-noche", {
    slug: "mesa-de-noche-aura",
    code: "KR-MN-01",
    name: "Mesa de noche Aura",
    summary: "Líneas limpias y estética ligera.",
    description: [
      "De líneas limpias y estética ligera, AURA se integra con facilidad en distintos ambientes.",
      "Su diseño prioriza la practicidad sin perder una lectura elegante y bien resuelta.",
    ],
    images: ["kormos-noche-aura"],
  }),
  madera("mesas-de-noche", {
    slug: "mesa-de-noche-alma",
    code: "KR-MN-02",
    name: "Mesa de noche Alma",
    summary: "Equilibrio y funcionalidad para acompañar el descanso.",
    description: [
      "Diseñada para acompañar el descanso con equilibrio y funcionalidad, ALMA aporta calidez al espacio a través de sus materiales y proporciones.",
      "Su presencia es sutil, pero lo suficientemente definida para complementar el entorno.",
    ],
    images: ["kormos-noche-alma"],
    featured: true,
  }),
  madera("mesas-de-noche", {
    slug: "mesa-de-noche-noa",
    code: "KR-MN-03",
    name: "Mesa de noche Noa",
    summary: "Estabilidad y proporciones bien definidas.",
    description: [
      "Con una presencia más firme, NOA destaca por su estabilidad y proporciones bien definidas.",
      "Ideal para espacios que buscan una pieza funcional con carácter.",
    ],
    images: ["kormos-pieza-noche"],
  }),
  madera("mesas-de-noche", {
    slug: "mesa-de-noche-lena",
    code: "KR-MN-04",
    name: "Mesa de noche Lena",
    summary: "Proporciones limpias y la calidez natural de la madera.",
    description: ["Pensada para acompañar el espacio de descanso con equilibrio y funcionalidad, LENA combina proporciones limpias con la calidez natural de la madera."],
    images: ["kormos-noche-lena"],
  }),

  // ---------------- Mesas de centro ----------------
  madera("mesas-de-centro", {
    slug: "mesa-de-centro-dos-alturas",
    code: "KR-MC-01",
    name: "Mesa de centro a dos alturas",
    summary: "Dos niveles que crean dinamismo visual y aprovechan mejor el espacio.",
    description: [
      "Diseñada para destacar desde cualquier ángulo, esta mesa de dos niveles combina funcionalidad y estética en una sola pieza.",
      "Su estructura en madera aporta calidez, mientras que el juego de alturas crea dinamismo visual y mayor aprovechamiento del espacio.",
    ],
    images: ["kormos-pieza-centro"],
    featured: true,
  }),
  madera("mesas-de-centro", {
    slug: "mesa-de-centro-baja",
    code: "KR-MC-02",
    name: "Mesa de centro baja",
    summary: "El punto de encuentro del espacio, con orden y continuidad.",
    description: [
      "Diseñada para convertirse en el punto de encuentro del espacio, combina proporciones equilibradas con la calidez natural de la madera.",
      "Su presencia aporta orden y continuidad, integrándose con facilidad en distintos ambientes.",
    ],
    images: ["kormos-centro-baja"],
  }),
  madera("mesas-de-centro", {
    slug: "mesa-de-centro-organica",
    code: "KR-MC-03",
    name: "Mesa de centro orgánica",
    summary: "Estructura sólida y un elemento central con carácter.",
    description: [
      "Con una presencia más firme, destaca por su estructura sólida y proporciones bien definidas.",
      "Ideal para espacios que buscan un elemento central con carácter y funcionalidad.",
    ],
    images: ["kormos-centro-organica"],
  }),

  // ---------------- Marcos para espejo ----------------
  ...(
    [
      ["marco-organico", "KR-ES-01", "Marco orgánico", "Formas orgánicas que suavizan la composición.", "kormos-pieza-espejo"],
      ["marco-en-arco", "KR-ES-02", "Marco en arco", "Molduras en arco con una lectura clásica.", "kormos-espejo-arco"],
      ["marco-curvo", "KR-ES-03", "Marco curvo", "Esquinas curvas en madera maciza.", "kormos-espejo-curvo"],
      ["marco-cordon", "KR-ES-04", "Marco cordón", "Cordón tallado a mano, textura y oficio.", "kormos-espejo-cordon"],
    ] as const
  ).map(([slug, code, name, summary, image]) =>
    madera("espejos", {
      slug,
      code,
      name,
      summary,
      description: [
        "En Kormós diseñamos y fabricamos marcos de espejo en madera, concebidos como elementos que aportan carácter, calidez y equilibrio a cada espacio.",
        "Cada marco cuida la proporción, el acabado y la calidad del material, para integrarse con naturalidad en distintos estilos de interior.",
      ],
      images: [image],
    }),
  ),

  // ---------------- Cuadros de madera ----------------
  ...(
    [
      ["cuadro-relieve-geometrico", "KR-CU-01", "Cuadro relieve geométrico", "Composición geométrica sobre fondo claro.", "kormos-pieza-cuadro"],
      ["cuadro-relieve-tierra", "KR-CU-02", "Cuadro relieve tierra", "Relieves orgánicos en tono tierra.", "kormos-cuadro-relieve"],
      ["cuadro-relieve-salvia", "KR-CU-03", "Cuadro relieve salvia", "Geometría suave en verde salvia.", "kormos-cuadro-salvia"],
    ] as const
  ).map(([slug, code, name, summary, image]) =>
    madera("cuadros", {
      slug,
      code,
      name,
      summary,
      description: [
        "Cuadros en madera que aportan textura, calidez y carácter a los espacios.",
        "Cada pieza cuida la composición, el acabado y la calidad del material. Colores y diseños a elegir.",
      ],
      images: [image],
      variantLabel: "Color",
      variants: [
        { id: "natural", name: "Madera natural", swatch: { media: "mat-roble" } },
        { id: "tierra", name: "Tierra", swatch: { hex: "#6b5444" } },
        { id: "salvia", name: "Salvia", swatch: { hex: "#b9c2a4" } },
        { id: "arena", name: "Arena", swatch: { hex: "#d9cfbf" } },
      ],
    }),
  ),

  // ---------------- Piezas a medida (Instagram) ----------------
  {
    slug: "bench-tapizado",
    code: "KR-AM-01",
    name: "Bench tapizado",
    category: "a-medida",
    collection: "A medida",
    summary: "Madera y textura en un diseño cálido, sencillo y atemporal.",
    description: [
      "Una pieza donde la madera y la textura se encuentran para crear un diseño cálido, sencillo y atemporal.",
      "Este bench se adapta a diferentes espacios, acabados y textiles, porque cada pieza debe responder a quien la imagina.",
    ],
    materials: [
      { label: "Estructura", value: "Madera maciza" },
      { label: "Tapizado", value: "A elección" },
      { label: "Fabricación", value: "A medida" },
    ],
    dimensionsNote: "Se fabrica a la medida de tu espacio.",
    status: "bajo_pedido",
    showPrice: false,
    images: ["kormos-bench"],
    variantLabel: "Tapizado",
    variants: [
      { id: "olivo", name: "Verde olivo", swatch: { media: "tela-olivo" }, images: ["kormos-bench"] },
      { id: "moca", name: "Moca", swatch: { hex: "#8b7262" }, images: ["kormos-bench-moca"] },
    ],
    files: {},
    featured: true,
  },
  {
    slug: "mesa-de-comedor-estriada",
    code: "KR-AM-02",
    name: "Mesa de comedor estriada",
    category: "a-medida",
    collection: "A medida",
    summary: "Líneas suaves y una base estriada que le da personalidad propia.",
    description: [
      "Diseño que habla sin necesidad de excesos: una mesa de líneas suaves, proporciones equilibradas y una base que le da personalidad propia.",
      "Para nosotros, un buen mueble comienza mucho antes de fabricarse: comienza con una buena idea.",
    ],
    materials: [
      { label: "Madera", value: "A elección" },
      { label: "Fabricación", value: "A medida" },
    ],
    dimensionsNote: "Diámetro y altura a la medida de tu comedor.",
    status: "bajo_pedido",
    showPrice: false,
    images: ["kormos-mesa-comedor"],
    variantLabel: "Madera",
    variants: MADERAS,
    files: {},
  },
  {
    slug: "mueble-de-bano-estriado",
    code: "KR-AM-03",
    name: "Mueble de baño estriado",
    category: "a-medida",
    collection: "A medida",
    summary: "Mueble de baño con frentes estriados y espejo de formas orgánicas.",
    description: [
      "Un mueble pensado para aportar carácter, funcionalidad y calidez al espacio, acompañado de un espejo de formas orgánicas que suaviza la composición.",
      "Cada línea, cada acabado y cada proporción tiene un propósito.",
    ],
    materials: [
      { label: "Madera", value: "A elección (MDF hidrófugo para zonas húmedas)" },
      { label: "Fabricación", value: "A medida" },
    ],
    dimensionsNote: "Se diseña según las medidas de tu baño.",
    status: "bajo_pedido",
    showPrice: false,
    images: ["kormos-bano", "kormos-bano-detalle"],
    variantLabel: "Madera",
    variants: MADERAS,
    files: {},
  },
];
