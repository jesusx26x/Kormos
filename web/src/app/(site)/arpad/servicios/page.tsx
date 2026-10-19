import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { ContactBand, GroupBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServicePanel, type Service } from "@/components/sections/ServicePanel";
import { Tabs } from "@/components/Tabs";

export const metadata: Metadata = pageMeta({
  title: "Servicios · Arpad Studio",
  description: "Diseño arquitectónico, interiores, E-Design, remodelación, modelado 3D y construcción en República Dominicana.",
  path: "/arpad/servicios",
  brand: "arpad",
  image: "/og/p-arpad-tienda-3.jpg",
});

// Textos de partida redactados a partir de las publicaciones de Arpad: validar con el estudio.
const SERVICES: Service[] = [
  {
    title: "Diseño arquitectónico",
    text: "Concebimos proyectos residenciales y comerciales desde la idea hasta los planos: volúmenes definidos, luz natural y una relación clara con el entorno.",
    includes: ["Levantamiento y programa de necesidades", "Anteproyecto: distribución, volumetría y fachadas", "Visualización 3D con Aracena Studio", "Planos para permisos y construcción"],
    idealFor: "viviendas nuevas, villas y locales comerciales.",
    media: "arpad-villa",
  },
  {
    title: "Diseño de interiores",
    text: "Espacios que hablan de quien los habita. Elegimos materiales que mantienen su esencia con el tiempo y creamos atmósferas cálidas, sofisticadas y atemporales.",
    includes: ["Concepto y moodboard de materiales", "Distribución y selección de mobiliario", "Iluminación, acabados y paleta", "Mobiliario a medida con Kormós"],
    idealFor: "salas, cocinas, habitaciones, baños y espacios de trabajo.",
    media: "arpad-moodboard",
  },
  {
    title: "E-Design",
    text: "Diseño completamente digital y a distancia, con el mismo nivel de detalle. Transformamos espacios de forma creativa y funcional sin importar dónde estés.",
    includes: ["Reuniones virtuales de diseño", "Propuesta en 3D del espacio", "Lista de compras y especificaciones", "Guía para ejecutar con tu propio equipo"],
    idealFor: "clientes fuera del país o proyectos que se ejecutan con su propio contratista.",
    media: "arpad-tienda",
  },
  {
    title: "Remodelación",
    text: "A veces no es cambiar la arquitectura, sino reinterpretarla. Llevamos fachadas e interiores de lo tradicional a lo contemporáneo con decisiones precisas.",
    includes: ["Diagnóstico del espacio existente", "Propuesta de reinterpretación", "Visualización del antes y el después", "Ejecución de la obra"],
    idealFor: "fachadas, marquesinas, cocinas y espacios que piden una nueva vida.",
    media: "arpad-fachada-noche",
  },
  {
    title: "Modelado 3D",
    text: "Visualiza tu proyecto antes de construirlo. Modelamos cada espacio y lo llevamos a imágenes hiperrealistas junto a Aracena Studio.",
    includes: ["Modelado del proyecto", "Renders interiores y exteriores", "Recorridos virtuales", "Material para presentaciones y ventas"],
    idealFor: "aprobar decisiones de diseño, preventas y presentaciones.",
    media: "aracena-living",
  },
  {
    title: "Construcción y ejecución",
    text: "Llevamos el diseño a obra y cuidamos cada detalle hasta la entrega, coordinando oficios, materiales y mobiliario.",
    includes: ["Presupuesto y planificación", "Dirección y supervisión de obra", "Coordinación de oficios y proveedores", "Entrega final del espacio"],
    idealFor: "proyectos que quieren un solo equipo del diseño a la entrega.",
    media: "arpad-piscina-2",
  },
];

export default function ArpadServicios() {
  return (
    <>
      <PageHeader
        media="arpad-tienda-3"
        eyebrow="Servicios"
        title="Creamos, diseñamos y construimos la visión que sueñas"
        lead="Un mismo estudio del concepto a la entrega, presencial o a distancia."
      />
      <section className="section" aria-label="Servicios de Arpad Studio">
        <div className="container">
          <Tabs label="Servicios" items={SERVICES.map((s) => ({ label: s.title, content: <ServicePanel brand="arpad" service={s} /> }))} />
        </div>
      </section>
      <GroupBand slug="arpad" />
      <ContactBand
        slug="arpad"
        title="¿No sabes qué servicio necesitas?"
        text="Cuéntanos tu idea y te orientamos. La primera conversación es para entender tu proyecto."
        label="Hablar con Arpad Studio"
      />
    </>
  );
}
