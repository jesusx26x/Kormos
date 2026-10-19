import type { Field } from "payload";
import { slugFrom } from "./hooks";

/** Enlace de la página (/kormos/catalogo/<enlace>); se rellena solo a partir del nombre. */
export const slugField = (from: string): Field => ({
  name: "slug",
  label: "Enlace",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: "Se genera a partir del nombre. Cambiarlo rompe los enlaces que ya se hayan compartido.",
  },
  hooks: { beforeValidate: [slugFrom(from)] },
});

/** Interruptor para ocultar una ficha del sitio sin borrarla. */
export const publishedField: Field = {
  name: "published",
  label: "Visible en el sitio",
  type: "checkbox",
  defaultValue: true,
  index: true,
  admin: { position: "sidebar", description: "Desmárcalo para ocultarla sin borrarla." },
};

/** Párrafos: un bloque de texto donde una línea en blanco separa párrafos. */
export const paragraphsField = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: "textarea",
  localized: true,
  admin: { rows: 6, description: description ?? "Deja una línea en blanco entre párrafos." },
});

/** Precio con moneda por producto o paquete, y opción de mostrarlo o no. */
export const priceFields: Field[] = [
  {
    type: "row",
    fields: [
      { name: "priceAmount", label: "Precio", type: "number", min: 0, admin: { width: "50%" } },
      {
        name: "priceCurrency",
        label: "Moneda",
        type: "select",
        defaultValue: "RD$",
        options: [
          { label: "RD$ · peso dominicano", value: "RD$" },
          { label: "US$ · dólar", value: "US$" },
        ],
        admin: { width: "50%" },
      },
    ],
  },
  {
    name: "showPrice",
    label: "Mostrar el precio en el sitio",
    type: "checkbox",
    defaultValue: false,
    admin: { description: 'Si está desmarcado (o no hay precio), el sitio dice "Precio a consultar".' },
  },
];
