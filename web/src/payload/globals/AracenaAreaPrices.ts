import type { ArrayField, GlobalConfig } from "payload";
import { anyone, signedIn } from "../access";
import { DRAG_HINT } from "../fields";
import { revalidateGlobal } from "../hooks";

const areaList = (name: string, label: string): ArrayField => ({
  name,
  label,
  labels: { singular: "Área", plural: "Áreas" },
  type: "array",
  admin: { description: `Para cambiar el orden, ${DRAG_HINT}.`, initCollapsed: true },
  fields: [
    {
      type: "row",
      fields: [
        { name: "area", label: "Área", type: "text", required: true, localized: true, admin: { width: "50%" } },
        { name: "priceFrom", label: "Desde", type: "number", min: 0, required: true, admin: { width: "25%" } },
        { name: "priceTo", label: "Hasta", type: "number", min: 0, admin: { width: "25%", description: "Opcional." } },
      ],
    },
  ],
});

/** Renders sueltos por área (fachada, sala, cocina…) en la página de paquetes de Aracena. */
export const AracenaAreaPrices: GlobalConfig = {
  slug: "precios-aracena",
  label: "Precios por área (Aracena)",
  admin: {
    group: "Arpad y Aracena",
    hideAPIURL: true,
    description: "Precios de renders sueltos por área. Si las dos listas están vacías, la sección no aparece en el sitio.",
  },
  access: { read: anyone, update: signedIn },
  versions: { max: 20 },
  hooks: revalidateGlobal(["paquetes"]),
  fields: [
    {
      name: "currency",
      label: "Moneda",
      type: "select",
      required: true,
      defaultValue: "US$",
      options: [
        { label: "US$ · dólar", value: "US$" },
        { label: "RD$ · peso dominicano", value: "RD$" },
      ],
      admin: { width: "50%" },
    },
    areaList("exterior", "Exteriores"),
    areaList("interior", "Interiores"),
    {
      name: "note",
      label: "Nota bajo los precios",
      type: "textarea",
      localized: true,
      admin: { description: "Aparece debajo de los paquetes y de los precios por área." },
    },
  ],
};
