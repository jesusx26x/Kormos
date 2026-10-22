import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { Split } from "@/components/sections/Cards";
import { ContactBand } from "@/components/sections/GroupBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { NumberedList, Section } from "@/components/sections/Section";
import styles from "@/components/sections/Sections.module.css";
import { getArpadProcess } from "@/data/studio";

export const metadata: Metadata = pageMeta({
  title: "Cómo trabajamos · Arpad Studio",
  description: "Cómo trabajamos: de la primera conversación a la entrega, con un solo equipo de diseño, visualización y ejecución.",
  path: "/arpad/proceso",
  brand: "arpad",
  image: "/og/p-arpad-moodboard.jpg",
});

export default async function ArpadProceso() {
  const steps = await getArpadProcess();
  return (
    <>
      <PageHeader
        media="arpad-moodboard"
        eyebrow="Proceso"
        title="Diseñar con intención, ejecutar con cuidado"
        lead="Cada proyecto es una oportunidad para diseñar experiencias que se sientan como hogar. Así lo llevamos de la idea a la entrega."
      />
      {steps.length > 0 ? (
        <Section eyebrow="Paso a paso" title="De la primera conversación a la entrega">
          <NumberedList items={steps} />
        </Section>
      ) : null}
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
