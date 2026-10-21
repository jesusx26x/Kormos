"use client";

import { useAllFormFields, useDocumentInfo } from "@payloadcms/ui";
import styles from "./admin.module.css";

type Fields = Record<string, { value?: unknown } | undefined>;
type Rule = { label: string; done: (f: Fields) => boolean; hint?: (f: Fields) => string | null; optional?: boolean };

const val = (f: Fields, path: string) => f[path]?.value;
const filled = (f: Fields, path: string) => {
  const v = val(f, path);
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "number") return !Number.isNaN(v);
  return typeof v === "string" ? v.trim().length > 0 : v != null && v !== false;
};
// Un campo "array" guarda en el formulario el número de filas
const rows = (f: Fields, path: string) => Number(val(f, path) ?? 0);

const RULES: Record<string, Rule[]> = {
  productos: [
    { label: "Nombre y código", done: (f) => filled(f, "name") && filled(f, "code") },
    { label: "Foto principal", done: (f) => filled(f, "images") },
    { label: "Categoría", done: (f) => filled(f, "category") },
    { label: "Resumen de una frase", done: (f) => filled(f, "summary") },
    { label: "Descripción", done: (f) => filled(f, "description") },
    { label: "Medidas", done: (f) => ["height", "width", "depth"].some((p) => val(f, p) != null && val(f, p) !== "") },
    { label: "Materiales", done: (f) => rows(f, "materials") > 0 },
    {
      label: "Precio",
      done: (f) => !val(f, "showPrice") || filled(f, "priceAmount"),
      hint: (f) => (val(f, "showPrice") ? null : 'El sitio dirá "Precio a consultar".'),
    },
    { label: "Archivos de descarga", done: (f) => ["fileSkp", "fileDwg", "filePdf"].some((p) => filled(f, p)), optional: true },
    { label: "Acabados", done: (f) => rows(f, "variants") > 0, optional: true },
  ],
  proyectos: [
    { label: "Marca y título", done: (f) => filled(f, "brand") && filled(f, "title") },
    { label: "Resumen", done: (f) => filled(f, "summary") },
    { label: "Foto de portada", done: (f) => filled(f, "cover") },
    { label: "Galería", done: (f) => filled(f, "gallery"), optional: true },
    { label: "Descripción", done: (f) => filled(f, "description"), optional: true },
    { label: "Ubicación", done: (f) => filled(f, "location"), optional: true },
  ],
  paquetes: [
    { label: "Nombre", done: (f) => filled(f, "name") },
    { label: "Qué incluye", done: (f) => filled(f, "includes") },
    { label: "Tamaño del proyecto", done: (f) => filled(f, "scale") },
    {
      label: "Precio",
      done: (f) => !val(f, "showPrice") || filled(f, "priceAmount"),
      hint: (f) => (val(f, "showPrice") ? null : "Se muestra el tamaño del proyecto en su lugar."),
    },
  ],
  servicios: [
    { label: "Nombre", done: (f) => filled(f, "title") },
    { label: "Resumen", done: (f) => filled(f, "summary") },
    { label: "Descripción", done: (f) => filled(f, "text") },
    { label: "Foto", done: (f) => filled(f, "image") },
    { label: "Qué incluye", done: (f) => filled(f, "includes"), optional: true },
  ],
};

/** Dirección pública de la ficha, para abrirla después de guardar. */
function publicUrl(collection: string, f: Fields): string | null {
  const slug = val(f, "slug");
  if (collection === "productos" && typeof slug === "string" && slug) return `/kormos/catalogo/${slug}`;
  if (collection === "proyectos" && typeof slug === "string" && slug && typeof val(f, "brand") === "string") return `/${val(f, "brand")}/proyectos/${slug}`;
  if (collection === "paquetes") return "/aracena/paquetes";
  if (collection === "servicios") return "/arpad/servicios";
  return null;
}

/** Tarjeta "Lista para publicar": se marca sola mientras se llena la ficha. */
export function ReadyChecklist() {
  const [fields] = useAllFormFields();
  const { collectionSlug, id } = useDocumentInfo();
  const rules = collectionSlug ? RULES[collectionSlug] : undefined;
  if (!rules) return null;

  const f = fields as Fields;
  const required = rules.filter((r) => !r.optional);
  const doneRequired = required.filter((r) => r.done(f)).length;
  const ready = doneRequired === required.length;
  const visible = val(f, "published") !== false;
  const url = id ? publicUrl(collectionSlug!, f) : null;

  return (
    <section className={styles.ready} data-ready={ready} aria-label="Lista para publicar">
      <header className={styles.readyHead}>
        <p className={styles.readyTitle}>{ready ? "Lista para publicar" : "Antes de publicar"}</p>
        <p className={styles.readyCount}>
          {doneRequired} de {required.length}
        </p>
      </header>
      <div className={styles.readyBar} aria-hidden="true">
        <span style={{ width: `${(doneRequired / required.length) * 100}%` }} />
      </div>
      <ul className={styles.readyList}>
        {rules.map((r) => {
          const done = r.done(f);
          const hint = r.hint?.(f);
          return (
            <li key={r.label} data-done={done}>
              <span className={styles.readyMark} aria-hidden="true">
                {done ? "✓" : ""}
              </span>
              <span>
                {r.label}
                {r.optional ? <small> (opcional)</small> : null}
                {hint ? <small className={styles.readyHint}>{hint}</small> : null}
              </span>
              <span className={styles.srOnly}>{done ? "listo" : "falta"}</span>
            </li>
          );
        })}
      </ul>
      {url && visible ? (
        <a className={styles.readyLink} href={url} target="_blank" rel="noopener noreferrer">
          Ver en el sitio ↗
        </a>
      ) : null}
      {!visible ? <p className={styles.readyHint}>Está oculta: no aparece en el sitio hasta que marques «Visible en el sitio».</p> : null}
    </section>
  );
}
