import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { brandField, previewField, publishedField, quickFilters, readyField } from "../fields";
import { revalidateCollection } from "../hooks";

/** Servicios de cada marca (hoy los muestra Arpad: inicio y página de servicios). */
export const Services: CollectionConfig = {
  slug: "servicios",
  labels: { singular: "Servicio", plural: "Servicios" },
  orderable: true,
  defaultSort: "_order",
  admin: {
    group: "Arpad y Aracena",
    useAsTitle: "title",
    defaultColumns: ["preview", "brand", "published"],
    hideAPIURL: true,
    components: { beforeListTable: quickFilters([]) },
    description: "Servicios que aparecen en el inicio y en la página de servicios. Arrastra las filas para cambiar el orden.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: revalidateCollection(["servicios"]),
  fields: [
    { name: "title", label: "Nombre", type: "text", required: true, localized: true, admin: { description: 'Ej.: "Diseño de interiores"' } },
    {
      name: "summary",
      label: "Resumen",
      type: "textarea",
      required: true,
      localized: true,
      maxLength: 160,
      admin: { rows: 2, description: "Una frase corta. Aparece en la lista de servicios del inicio." },
    },
    {
      name: "text",
      label: "Descripción",
      type: "textarea",
      required: true,
      localized: true,
      admin: { rows: 4, description: "Aparece en la pestaña del servicio." },
    },
    {
      name: "includes",
      label: "Qué incluye",
      type: "text",
      hasMany: true,
      localized: true,
      admin: { description: "Escribe cada punto y pulsa Enter." },
    },
    {
      name: "idealFor",
      label: "Ideal para",
      type: "text",
      localized: true,
      admin: { description: 'Ej.: "salas, cocinas, habitaciones y baños."' },
    },
    { name: "image", label: "Foto", type: "upload", relationTo: "fotos", required: true },
    readyField,
    previewField("Servicio"),
    brandField(),
    publishedField,
  ],
};
