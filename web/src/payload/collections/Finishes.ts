import type { CollectionConfig } from "payload";
import { anyone, signedIn } from "../access";
import { previewField, slugField } from "../fields";
import { blockDeleteIfUsedByProducts, revalidateCollection } from "../hooks";

/** Maderas, telas y colores que se reutilizan en varias piezas. */
export const Finishes: CollectionConfig = {
  slug: "acabados",
  labels: { singular: "Acabado", plural: "Acabados" },
  orderable: true,
  defaultSort: "_order",
  admin: {
    group: "Kormós",
    useAsTitle: "name",
    defaultColumns: ["preview", "kind"],
    hideAPIURL: true,
    description: "Maderas, telas y colores. Cada pieza elige cuáles ofrece; la muestra aparece en el selector de la ficha.",
  },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  hooks: { ...revalidateCollection(["catalogo"]), beforeDelete: [blockDeleteIfUsedByProducts("este acabado", "variants.finish")] },
  fields: [
    previewField("Acabado"),
    { name: "name", label: "Nombre", type: "text", required: true, localized: true, admin: { description: 'Ej.: "Nogal", "Bouclé gris"' } },
    {
      name: "kind",
      label: "Tipo",
      type: "select",
      required: true,
      defaultValue: "madera",
      options: [
        { label: "Madera", value: "madera" },
        { label: "Tela", value: "tela" },
        { label: "Color o laca", value: "color" },
        { label: "Otro", value: "otro" },
      ],
    },
    {
      name: "swatch",
      label: "Muestra",
      type: "upload",
      relationTo: "fotos",
      admin: { description: "Foto cuadrada de la textura (madera, tela). Si no hay, se usa el color." },
    },
    {
      name: "hex",
      label: "Color",
      type: "text",
      admin: { description: "Código de color, p. ej. #8a6a4f. Solo si no hay foto de muestra." },
      validate: (value: unknown) => !value || /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(value)) || "Usa un código como #8a6a4f.",
    },
    slugField("name"),
  ],
};
