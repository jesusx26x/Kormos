import type { GlobalConfig } from "payload";
import { anyone, signedIn } from "../access";
import { revalidateGlobal } from "../hooks";

/** Preguntas frecuentes de la página de paquetes de Aracena. */
export const AracenaFaq: GlobalConfig = {
  slug: "preguntas-aracena",
  label: "Preguntas frecuentes (Aracena)",
  admin: { group: "Arpad y Aracena" },
  access: { read: anyone, update: signedIn },
  hooks: revalidateGlobal(["paquetes"]),
  fields: [
    {
      name: "items",
      label: "Preguntas",
      labels: { singular: "Pregunta", plural: "Preguntas" },
      type: "array",
      fields: [
        { name: "question", label: "Pregunta", type: "text", required: true, localized: true },
        { name: "answer", label: "Respuesta", type: "textarea", required: true, localized: true },
      ],
    },
  ],
};
