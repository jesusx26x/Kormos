import { Reveal } from "../Reveal";
import styles from "./Sections.module.css";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  tone?: "default" | "surface";
  children?: React.ReactNode;
};

/** Sección con encabezado editorial: eyebrow + título + entradilla. */
export function Section({ id, eyebrow, title, intro, tone = "default", children }: SectionProps) {
  const headingId = id ? `${id}-titulo` : undefined;
  return (
    <section id={id} className={`section ${tone === "surface" ? styles.surface : ""}`} aria-labelledby={title ? headingId : undefined}>
      <div className="container">
        {title ? (
          <Reveal as="header" className={styles.sectionHead}>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2 id={headingId} className={`display ${styles.sectionTitle}`}>
              {title}
            </h2>
            {intro ? <p className={`lead ${styles.sectionIntro}`}>{intro}</p> : null}
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export type NumberedItem = { title: string; text: string };

/** Lista numerada 01, 02… para servicios y procesos. */
export function NumberedList({ items, compact = false }: { items: NumberedItem[]; compact?: boolean }) {
  return (
    <ol className={`${styles.numbered} ${compact ? styles.numberedCompact : ""}`}>
      {items.map((item, i) => (
        <Reveal as="li" key={item.title} className={styles.numberedItem} delay={(i % 3) * 60}>
          <span className={styles.number} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={styles.numberedTitle}>{item.title}</h3>
          <p className={styles.numberedText}>{item.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/** Cita o manifiesto a gran tamaño. */
export function Statement({ quote, children }: { quote: string; children?: React.ReactNode }) {
  return (
    <div className={styles.statement}>
      <Reveal as="blockquote" className={`display ${styles.quote}`}>
        {quote}
      </Reveal>
      {children ? (
        <Reveal className={styles.statementBody} delay={80}>
          {children}
        </Reveal>
      ) : null}
    </div>
  );
}
