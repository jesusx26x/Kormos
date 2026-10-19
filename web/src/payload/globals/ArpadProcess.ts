import type { GlobalConfig } from "payload";
import { anyone, signedIn } from "../access";
import { revalidateGlobal } from "../hooks";

/** Pasos del proceso de trabajo de Arpad (página Proceso). */
export const ArpadProcess: GlobalConfig = {
  slug: "proceso-arpad",
  label: "Proceso de trabajo (Arpad)",
  admin: { group: "Arpad y Aracena", hideAPIURL: true },
  access: { read: anyone, update: signedIn },
  hooks: revalidateGlobal(["proceso"]),
  fields: [
    {
      name: "steps",
      label: "Pasos",
      labels: { singular: "Paso", plural: "Pasos" },
      type: "array",
      admin: { description: "Se numeran solos en el orden de la lista. Arrastra para reordenar." },
      fields: [
        { name: "title", label: "Paso", type: "text", required: true, localized: true, admin: { description: 'Ej.: "Conversación inicial"' } },
        { name: "text", label: "Descripción", type: "textarea", required: true, localized: true, admin: { rows: 2 } },
      ],
    },
  ],
};
