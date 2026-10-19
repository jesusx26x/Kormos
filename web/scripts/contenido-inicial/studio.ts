// CONTENIDO INICIAL: solo lo usa scripts/seed.mts para la primera carga del panel.
// El sitio ya no lee este archivo: el contenido se edita en /admin.
import type { MediaKey } from "@/lib/media.generated";

// Textos de partida redactados a partir de las publicaciones de Arpad: validar con el estudio.
export const ARPAD_SERVICES: {
  title: string;
  summary: string;
  text: string;
  includes: string[];
  idealFor: string;
  media: MediaKey;
}[] = [
  {
    title: "Diseño arquitectónico",
    summary: "Proyectos residenciales y comerciales: concepto, distribución, volumetría y planos.",
    text: "Concebimos proyectos residenciales y comerciales desde la idea hasta los planos: volúmenes definidos, luz natural y una relación clara con el entorno.",
    includes: ["Levantamiento y programa de necesidades", "Anteproyecto: distribución, volumetría y fachadas", "Visualización 3D con Aracena Studio", "Planos para permisos y construcción"],
    idealFor: "viviendas nuevas, villas y locales comerciales.",
    media: "arpad-villa",
  },
  {
    title: "Diseño de interiores",
    summary: "Materialidad, atmósfera y mobiliario pensados para quien habita el espacio.",
    text: "Espacios que hablan de quien los habita. Elegimos materiales que mantienen su esencia con el tiempo y creamos atmósferas cálidas, sofisticadas y atemporales.",
    includes: ["Concepto y moodboard de materiales", "Distribución y selección de mobiliario", "Iluminación, acabados y paleta", "Mobiliario a medida con Kormós"],
    idealFor: "salas, cocinas, habitaciones, baños y espacios de trabajo.",
    media: "arpad-moodboard",
  },
  {
    title: "E-Design",
    summary: "Diseño completamente digital y a distancia, con el mismo nivel de detalle.",
    text: "Diseño completamente digital y a distancia, con el mismo nivel de detalle. Transformamos espacios de forma creativa y funcional sin importar dónde estés.",
    includes: ["Reuniones virtuales de diseño", "Propuesta en 3D del espacio", "Lista de compras y especificaciones", "Guía para ejecutar con tu propio equipo"],
    idealFor: "clientes fuera del país o proyectos que se ejecutan con su propio contratista.",
    media: "arpad-tienda",
  },
  {
    title: "Remodelación",
    summary: "Del antes al después: reinterpretamos fachadas e interiores para llevarlos a su mejor versión.",
    text: "A veces no es cambiar la arquitectura, sino reinterpretarla. Llevamos fachadas e interiores de lo tradicional a lo contemporáneo con decisiones precisas.",
    includes: ["Diagnóstico del espacio existente", "Propuesta de reinterpretación", "Visualización del antes y el después", "Ejecución de la obra"],
    idealFor: "fachadas, marquesinas, cocinas y espacios que piden una nueva vida.",
    media: "arpad-fachada-noche",
  },
  {
    title: "Modelado 3D",
    summary: "Visualiza tu proyecto antes de construirlo, con renders hiperrealistas de Aracena Studio.",
    text: "Visualiza tu proyecto antes de construirlo. Modelamos cada espacio y lo llevamos a imágenes hiperrealistas junto a Aracena Studio.",
    includes: ["Modelado del proyecto", "Renders interiores y exteriores", "Recorridos virtuales", "Material para presentaciones y ventas"],
    idealFor: "aprobar decisiones de diseño, preventas y presentaciones.",
    media: "aracena-living",
  },
  {
    title: "Construcción y ejecución",
    summary: "Llevamos el diseño a obra y cuidamos cada detalle hasta la entrega.",
    text: "Llevamos el diseño a obra y cuidamos cada detalle hasta la entrega, coordinando oficios, materiales y mobiliario.",
    includes: ["Presupuesto y planificación", "Dirección y supervisión de obra", "Coordinación de oficios y proveedores", "Entrega final del espacio"],
    idealFor: "proyectos que quieren un solo equipo del diseño a la entrega.",
    media: "arpad-piscina-2",
  },
];

// Proceso propuesto a partir de los servicios publicados: validar con el estudio.
export const ARPAD_PROCESS = [
  { title: "Conversación inicial", text: "Escuchamos lo que necesitas, cómo vives o trabajas el espacio y lo que quieres transmitir. Puede ser presencial o virtual." },
  { title: "Levantamiento y concepto", text: "Visitamos el espacio o recibimos tus planos y medidas, y definimos el concepto, la materialidad y la atmósfera." },
  { title: "Diseño y visualización", text: "Desarrollamos la propuesta y la vemos en 3D con renders de Aracena Studio antes de tomar decisiones definitivas." },
  { title: "Desarrollo técnico", text: "Planos, especificaciones y presupuesto para construir sin sorpresas." },
  { title: "Ejecución", text: "Dirigimos la obra y coordinamos oficios, materiales y mobiliario a medida con Kormós." },
  { title: "Entrega", text: "Revisamos cada detalle contigo y te entregamos un espacio listo para habitar." },
];

// Equipo tal como figura en la biografía pública de Instagram: confirmar nombres, cargos y fotos con el estudio.
export const ARPAD_TEAM = [
  { name: "Arq. Beamel Padilla", role: "Arquitectura · Diseño y ejecución" },
  { name: "Arq. Brayant Aracena", role: "Arquitectura · Diseño y visualización" },
];
