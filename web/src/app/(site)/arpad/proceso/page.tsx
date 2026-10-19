import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { Split } from "@/components/sections/Cards";
import { ContactBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { NumberedList, Section } from "@/components/sections/Section";
import styles from "@/components/sections/Sections.module.css";

export const metadata: Metadata = pageMeta({
  title: "Proceso · Arpad Studio",
  description: "Cómo trabajamos: de la primera conversación a la entrega, con un solo equipo de diseño, visualización y ejecución.",
  path: "/arpad/proceso",
  brand: "arpad",
  image: "/og/p-arpad-moodboard.jpg",
});

// Proceso propuesto a partir de los servicios publicados: validar con el estudio.
const STEPS = [
  { title: "Conversación inicial", text: "Escuchamos lo que necesitas, cómo vives o trabajas el espacio y lo que quieres transmitir. Puede ser presencial o virtual." },
  { title: "Levantamiento y concepto", text: "Visitamos el espacio o recibimos tus planos y medidas, y definimos el concepto, la materialidad y la atmósfera." },
  { title: "Diseño y visualización", text: "Desarrollamos la propuesta y la vemos en 3D con renders de Aracena Studio antes de tomar decisiones definitivas." },
  { title: "Desarrollo técnico", text: "Planos, especificaciones y presupuesto para construir sin sorpresas." },
  { title: "Ejecución", text: "Dirigimos la obra y coordinamos oficios, materiales y mobiliario a medida con Kormós." },
  { title: "Entrega", text: "Revisamos cada detalle contigo y te entregamos un espacio listo para habitar." },
];

export default function ArpadProceso() {
  return (
    <>
      <PageHeader
        media="arpad-moodboard"
        eyebrow="Proceso"
        title="Diseñar con intención, ejecutar con cuidado"
        lead="Cada proyecto es una oportunidad para diseñar experiencias que se sientan como hogar. Así lo llevamos de la idea a la entrega."
      />
      <Section eyebrow="Paso a paso" title="De la primera conversación a la entrega">
        <NumberedList items={STEPS} />
      </Section>
      <Section tone="surface">
        <Split media="arpad-hall" reverse>
          <p className="eyebrow">Un mismo equipo</p>
          <h2 className={`display ${styles.sectionTitle}`}>Diseño que se visualiza, se ejecuta y se materializa</h2>
          <p>
            Aracena Studio visualiza el proyecto con renders hiperrealistas, Arpad Studio lo diseña y lo ejecuta, y Kormós fabrica el mobiliario a medida. Un solo
            interlocutor para todo el proceso.
          </p>
        </Split>
      </Section>
      <ContactBand
        slug="arpad"
        title="Empecemos por la primera conversación"
        text="Escríbenos y agendamos una llamada o una visita para conocer tu proyecto."
        label="Agendar con Arpad Studio"
        message="Quiero agendar una primera conversación sobre mi proyecto."
      />
    </>
  );
}
