import Link from "next/link";
import type { Project } from "@/data/projects";
import { BRANDS } from "@/lib/brands";
import { BackFloat } from "../BackFloat";
import { IconArrow } from "../Icons";
import { JsonLd } from "../JsonLd";
import { Reveal } from "../Reveal";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { ContactBand } from "../sections/GroupBand";
import { PageHeader } from "../sections/PageHeader";
import { BeforeAfter } from "./BeforeAfter";
import { Gallery } from "./Gallery";
import styles from "./Projects.module.css";

/** Ficha de proyecto común a Arpad y Aracena. */
export function ProjectDetail({ project, next }: { project: Project; next?: Project }) {
  const brand = BRANDS[project.brand];
  const base = `/${brand.slug}/proyectos`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: brand.name, path: `/${brand.slug}` },
          { name: "Proyectos", path: base },
          { name: project.title, path: `${base}/${project.slug}` },
        ])}
      />
      <PageHeader
        media={project.cover}
        eyebrow={[project.location, ...project.categories].filter(Boolean).join(" · ")}
        title={project.title}
        lead={project.summary}
        back={{ href: base, label: "Todos los proyectos" }}
      />

      <section className="section" aria-label="Sobre el proyecto">
        <div className={`container ${styles.detail}`}>
          <Reveal as="dl" className={styles.facts}>
            {project.location ? (
              <div>
                <dt>Ubicación</dt>
                <dd>{project.location}</dd>
              </div>
            ) : null}
            <div>
              <dt>Servicios</dt>
              <dd>
                <ul>
                  {project.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Créditos</dt>
              <dd>
                <ul>
                  {project.credits.map((c) => (
                    <li key={c.role + c.name}>
                      {c.role}:{" "}
                      {c.href ? (
                        // Solo los enlaces a otra marca evitan el scroll de Next (ver ScrollToTop)
                        <Link href={c.href} scroll={c.href.startsWith(`/${brand.slug}`) ? undefined : false}>
                          {c.name}
                        </Link>
                      ) : (
                        c.name
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            {project.source ? (
              <div>
                <dt>Publicado en</dt>
                <dd>
                  <a href={project.source} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </dd>
              </div>
            ) : null}
          </Reveal>
          <Reveal className={styles.body} delay={80}>
            {project.description.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {project.beforeAfter.length ? (
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="antes-despues">
          <div className="container">
            <h2 id="antes-despues" className={`eyebrow ${styles.blockTitle}`}>
              Antes y después
            </h2>
            <div className={styles.compareList}>
              {project.beforeAfter.map((pair) => (
                <BeforeAfter key={pair.label} before={pair.before} after={pair.after} label={pair.label} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="galeria">
        <div className="container">
          <h2 id="galeria" className={`eyebrow ${styles.blockTitle}`}>
            Galería
          </h2>
          <Gallery images={project.gallery} title={project.title} />
          {next ? (
            <nav className={styles.nextProject} aria-label="Siguiente proyecto" style={{ marginTop: "clamp(48px, 7vw, 96px)" }}>
              <p className="eyebrow">Siguiente proyecto</p>
              <Link href={`${base}/${next.slug}`}>
                {next.title} <IconArrow size={28} />
              </Link>
            </nav>
          ) : null}
        </div>
      </section>


      <ContactBand
        slug={brand.slug}
        title="¿Un proyecto como este?"
        text="Cuéntanos qué tienes en mente. Te respondemos por WhatsApp con los siguientes pasos."
        label={`Escribir a ${brand.name}`}
        message={["Vi este proyecto en su web y me interesa algo similar.", `*${project.title}*\n${SITE_URL}${base}/${project.slug}`]}
      />

      <BackFloat href={base} label="Proyectos" />
    </>
  );
}
