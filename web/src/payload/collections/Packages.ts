import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { DRAG_HINT, priceFields, publishedField, quickFilters, readyField } from "../fields";
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
    defaultColumns: ["name", "scale", "published"],
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
      label: "Cómo se cotiza",
      type: "text",
      required: true,
      localized: true,
      admin: { description: 'Ej.: "Precio según número de ambientes". Si marcas "Mostrar el precio", aquí aparece "Desde RD$ …" en su lugar.' },
    },
    ...priceFields,
    readyField,
    publishedField,
  ],
};
