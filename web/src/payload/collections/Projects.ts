import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { paragraphsField, previewField, publishedField, quickFilters, readyField, slugField } from "../fields";
import { revalidateCollection } from "../hooks";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const PROJECT_CATEGORIES = ["Residencial", "Comercial", "Remodelación", "Interiorismo", "Exterior", "Interior"] as const;

/** Proyectos de Arpad Studio y Aracena Studio. */
export const Projects: CollectionConfig = {
  slug: "proyectos",
  labels: { singular: "Proyecto", plural: "Proyectos" },
  orderable: true,
  defaultSort: "_order",
  admin: {
    group: "Arpad y Aracena",
    useAsTitle: "title",
    defaultColumns: ["preview", "brand", "categories", "published"],
    description: "Portafolio de Arpad Studio y Aracena Studio. Arrastra las filas para cambiar el orden.",
    hideAPIURL: true,
    components: {
      beforeListTable: quickFilters([
        { label: "Arpad Studio", where: { brand: "arpad" } },
        { label: "Aracena Studio", where: { brand: "aracena" } },
      ]),
    },
    preview: (doc) => (doc?.slug && doc?.brand ? `${SITE}/${doc.brand}/proyectos/${doc.slug}` : null),
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: revalidateCollection(["proyectos"]),
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Proyecto",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "brand",
                  label: "Marca",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Arpad Studio", value: "arpad" },
                    { label: "Aracena Studio", value: "aracena" },
                  ],
                  admin: { width: "40%" },
                },
                { name: "title", label: "Título", type: "text", required: true, localized: true, admin: { width: "60%" } },
              ],
            },
            {
              name: "summary",
              label: "Resumen",
              type: "textarea",
              required: true,
              localized: true,
              maxLength: 220,
              admin: { rows: 2, description: "Una o dos frases. Aparece en la tarjeta y al compartir el enlace." },
            },
            paragraphsField("description", "Descripción"),
            {
              type: "row",
              fields: [
                {
                  name: "categories",
                  label: "Categorías",
                  type: "select",
                  hasMany: true,
                  required: true,
                  options: PROJECT_CATEGORIES.map((c) => ({ label: c, value: c })),
                  admin: { width: "50%", description: "Sirven de filtros en el portafolio." },
                },
                { name: "location", label: "Ubicación", type: "text", admin: { width: "50%", description: 'Ej.: "Punta Cana"' } },
              ],
            },
            {
              name: "services",
              label: "Servicios",
              type: "text",
              hasMany: true,
              localized: true,
              admin: { description: 'Escribe cada servicio y pulsa Enter. Ej.: "Remodelación".' },
            },
          ],
        },
        {
          label: "Fotos",
          fields: [
            { name: "cover", label: "Foto de portada", type: "upload", relationTo: "fotos", required: true },
            { name: "gallery", label: "Galería", type: "upload", relationTo: "fotos", hasMany: true },
            {
              name: "beforeAfter",
              label: "Antes y después",
              labels: { singular: "Comparación", plural: "Comparaciones" },
              type: "array",
              admin: { description: "Dos fotos tomadas desde el mismo punto. El visitante desliza para comparar." },
              fields: [
                { name: "label", label: "Nombre", type: "text", required: true, localized: true, admin: { description: 'Ej.: "Fachada"' } },
                {
                  type: "row",
                  fields: [
                    { name: "before", label: "Antes", type: "upload", relationTo: "fotos", required: true, admin: { width: "50%" } },
                    { name: "after", label: "Después", type: "upload", relationTo: "fotos", required: true, admin: { width: "50%" } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Créditos",
          fields: [
            {
              name: "credits",
              label: "Créditos",
              labels: { singular: "Crédito", plural: "Créditos" },
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "role", label: "Rol", type: "text", required: true, localized: true, admin: { width: "35%", description: 'Ej.: "Renders"' } },
                    { name: "name", label: "Nombre", type: "text", required: true, admin: { width: "35%" } },
                    { name: "href", label: "Enlace", type: "text", admin: { width: "30%", description: 'Opcional. Ej.: "/aracena"' } },
                  ],
                },
              ],
            },
            {
              name: "source",
              label: "Publicación en Instagram",
              type: "text",
              admin: { description: "Enlace a la publicación original (opcional)." },
              validate: (value: unknown) => !value || /^https:\/\//.test(String(value)) || "Pega el enlace completo (https://…).",
            },
          ],
        },
      ],
    },
    readyField,
    previewField("Proyecto"),
    slugField("title"),
    publishedField,
  ],
};
