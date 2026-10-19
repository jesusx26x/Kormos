import type { CollectionConfig } from "payload";
import { anyone, signedIn } from "../access";
import { slugField } from "../fields";
import { revalidateCollection } from "../hooks";

export const Categories: CollectionConfig = {
  slug: "categorias",
  labels: { singular: "Categoría", plural: "Categorías" },
  orderable: true,
  defaultSort: "_order",
  admin: {
    group: "Kormós",
    hideAPIURL: true,
    useAsTitle: "name",
    defaultColumns: ["name", "singular", "slug"],
    description: "Grupos del catálogo. Arrastra las filas para cambiar el orden de los filtros.",
  },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  hooks: revalidateCollection(["catalogo"]),
  fields: [
    { name: "name", label: "Nombre (plural)", type: "text", required: true, localized: true, admin: { description: 'Ej.: "Mesas de noche"' } },
    { name: "singular", label: "Nombre (singular)", type: "text", required: true, localized: true, admin: { description: 'Ej.: "Mesa de noche"' } },
    slugField("name"),
  ],
};
