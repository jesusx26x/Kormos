import type { Field, GlobalConfig } from "payload";
import { anyone, signedIn } from "../access";
import { revalidateGlobal } from "../hooks";

const brandFields: Field[] = [
  {
    name: "tagline",
    label: "Frase de la marca",
    type: "text",
    localized: true,
    admin: { description: "Aparece en el pie de página y en la página Estudio." },
  },
  {
    name: "intro",
    label: "Presentación",
    type: "textarea",
    localized: true,
    admin: { rows: 4, description: "Quiénes son, en un párrafo. Aparece en el inicio de la marca y la leen los buscadores." },
  },
  {
    type: "row",
    fields: [
      {
        name: "instagram",
        label: "Usuario de Instagram",
        type: "text",
        admin: { width: "50%", description: "Sin la @. Ej.: kormos.rd" },
      },
      { name: "email", label: "Correo", type: "email", admin: { width: "50%", description: "Opcional. Aparece en el pie de página." } },
    ],
  },
];

/** Textos y contacto de cada marca. Un campo vacío usa el texto de partida del sitio. */
export const BrandInfo: GlobalConfig = {
  slug: "marcas",
  label: "Datos de las marcas",
  admin: { group: "Ajustes", hideAPIURL: true, description: "El WhatsApp es el mismo para las tres marcas (849-472-2473)." },
  access: { read: anyone, update: signedIn },
  hooks: revalidateGlobal(["marcas"]),
  fields: [
    {
      type: "tabs",
      tabs: [
        { name: "arpad", label: "Arpad Studio", fields: brandFields },
        { name: "kormos", label: "Kormós", fields: brandFields },
        { name: "aracena", label: "Aracena Studio", fields: brandFields },
      ],
    },
  ],
};
