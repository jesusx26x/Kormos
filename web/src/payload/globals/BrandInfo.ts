import type { Field, GlobalConfig } from "payload";
import { anyone, signedIn } from "../access";
import { revalidateGlobal } from "../hooks";

const brandFields: Field[] = [
  {
    name: "heroPhotos",
    label: "Fotos de portada",
    type: "upload",
    relationTo: "fotos",
    hasMany: true,
    maxRows: 6,
    admin: {
      description:
        "De 2 a 6 fotos horizontales y grandes (mínimo 2400 px de ancho). Pasan una tras otra con un zoom lento en la portada del sitio y arriba en el inicio de la marca. Arrástralas para cambiar el orden. Para que no se corte lo importante, abre la foto en Biblioteca → Fotos y marca su punto de enfoque. Si lo dejas vacío, se usan las fotos de siempre.",
    },
  },
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
  // Historial de cambios: cada guardado queda en "Versiones" y se puede restaurar
  versions: { max: 20 },
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
