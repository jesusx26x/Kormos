import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { DRAG_HINT, publishedField, quickFilters, readyField } from "../fields";
import { revalidateCollection } from "../hooks";

/** Paquetes de render de Aracena Studio. */
export const Packages: CollectionConfig = {
  slug: "paquetes",
  labels: { singular: "Paquete de render", plural: "Paquetes de render" },
  orderable: true,
  defaultSort: "_order",
  // Historial de cambios: cada guardado queda en "Versiones" y se puede restaurar
  versions: { maxPerDoc: 20 },
  admin: {
    group: "Arpad y Aracena",
    useAsTitle: "name",
    defaultColumns: ["name", "scale", "priceAmount", "published"],
    description: "Paquetes de render de Aracena Studio.",
    hideAPIURL: true,
    components: { beforeListTable: quickFilters([], DRAG_HINT) },
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: revalidateCollection(["paquetes"]),
  fields: [
    { name: "name", label: "Nombre", type: "text", required: true, localized: true },
    {
      name: "includes",
      label: "Qué incluye",
      type: "text",
      hasMany: true,
      required: true,
      localized: true,
      admin: { description: "Escribe cada punto y pulsa Enter." },
    },
    {
      name: "scale",
      label: "Tamaño del proyecto",
      type: "text",
      required: true,
      localized: true,
      admin: { description: 'Ej.: "Proyectos de 0 a 50 m²". Sin precio visible, esta nota va en el lugar del precio.' },
    },
    {
      type: "row",
      fields: [
        { name: "priceAmount", label: "Precio desde", type: "number", min: 0, admin: { width: "33%" } },
        { name: "priceTo", label: "Precio hasta", type: "number", min: 0, admin: { width: "33%", description: "Opcional." } },
        {
          name: "priceCurrency",
          label: "Moneda",
          type: "select",
          defaultValue: "US$",
          options: [
            { label: "RD$ · peso dominicano", value: "RD$" },
            { label: "US$ · dólar", value: "US$" },
          ],
          admin: { width: "34%" },
        },
      ],
    },
    {
      name: "showPrice",
      label: "Mostrar el precio en el sitio",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Si está desmarcado (o no hay precio), se muestra el tamaño del proyecto en su lugar." },
    },
    {
      name: "recommended",
      label: "Recomendado",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: 'Muestra la etiqueta "Recomendado" en este paquete.' },
    },
    readyField,
    publishedField,
  ],
};
