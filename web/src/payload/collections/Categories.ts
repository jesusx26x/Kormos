import type { CollectionConfig } from "payload";
import { anyone, signedIn } from "../access";
import { slugField } from "../fields";
import { blockDeleteIfUsedByProducts, revalidateCollection } from "../hooks";

export const Categories: CollectionConfig = {
  slug: "categorias",
  labels: { singular: "Categoría", plural: "Categorías" },
  orderable: true,
  defaultSort: "_order",
  admin: {
    group: "Kormós",
    hideAPIURL: true,
    useAsTitle: "name",
    defaultColumns: ["name", "singular"],
    description: "Grupos del catálogo. Sirven de filtros en el catálogo del sitio.",
    components: {
      beforeListTable: [
        {
          path: "/payload/admin/QuickFilters#QuickFilters",
          clientProps: { hint: "Para cambiar el orden de los filtros del catálogo, arrastra cada fila desde los puntitos de la izquierda." },
        },
      ],
    },
  },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  hooks: { ...revalidateCollection(["catalogo"]), beforeDelete: [blockDeleteIfUsedByProducts("esta categoría", "category")] },
  fields: [
    { name: "name", label: "Nombre (plural)", type: "text", required: true, localized: true, admin: { description: 'Ej.: "Mesas de noche"' } },
    { name: "singular", label: "Nombre (singular)", type: "text", required: true, localized: true, admin: { description: 'Ej.: "Mesa de noche"' } },
    slugField("name"),
  ],
};
