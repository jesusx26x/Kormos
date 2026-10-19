import { APIError, type Field } from "payload";
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
    description: "Se crea solo a partir del nombre al guardar la ficha por primera vez. Cambiarlo rompe los enlaces que ya se hayan compartido.",
    // Al crear todavía no existe: lo genera el gancho al guardar. Con valor (el
    // servidor ya lo rellenó) la condición se cumple y sí se valida al guardar.
    condition: (data, _sibling, { operation }) => operation !== "create" || Boolean(data?.slug),
    components: { Field: "/payload/admin/SlugField#SlugField" },
  },
  hooks: {
    beforeValidate: [slugFrom(from)],
    // Sin la condición de arriba nada valida un enlace vacío (nombre sin letras ni números)
    beforeChange: [
      ({ value, operation }) => {
        if ((operation === "create" && !value) || value === "" || value === null) {
          throw new APIError("El nombre necesita al menos una letra o un número: de ahí sale el enlace de la ficha.", 400, null, true);
        }
        return value;
      },
    ],
    // Payload añadiría " - Copy"; así la copia se reconoce y no choca con la original
    beforeDuplicate: [({ value }) => (typeof value === "string" && value ? `${value}-copia` : value)],
  },
});

/** Interruptor para ocultar una ficha del sitio sin borrarla. */
export const publishedField: Field = {
  name: "published",
  label: "Visible en el sitio",
  type: "checkbox",
  defaultValue: true,
  index: true,
  admin: {
    position: "sidebar",
    description: "Desmárcalo para ocultarla sin borrarla.",
    components: { Cell: "/payload/admin/cells#VisibleCell" },
  },
};

/** Columna de las listas con la foto principal y el nombre, que abre la ficha. */
export const previewField = (label: string): Field => ({
  name: "preview",
  label,
  type: "ui",
  admin: { components: { Cell: "/payload/admin/PreviewCell#PreviewCell" } },
});

/** Tarjeta "Lista para publicar" en la columna lateral de la ficha. */
export const readyField: Field = {
  name: "ready",
  label: "Lista para publicar",
  type: "ui",
  admin: { position: "sidebar", disableListColumn: true, components: { Field: "/payload/admin/ReadyChecklist#ReadyChecklist" } },
};

/**
 * Filtros de un clic encima de la tabla. "Todas" va siempre primero. La nota
 * (p. ej. cómo reordenar) solo tiene sentido en la lista, no en la ficha.
 */
export const quickFilters = (filters: { label: string; where: Record<string, string> }[], hint?: string) => [
  {
    path: "/payload/admin/QuickFilters#QuickFilters",
    clientProps: {
      filters: [{ label: "Todas" }, { label: "Visibles", where: { published: "true" } }, { label: "Ocultas", where: { published: "false" } }, ...filters],
      hint,
    },
  },
];

/** Nota para reordenar arrastrando, en las listas que lo permiten. */
export const DRAG_HINT = "Para cambiar el orden en el que aparecen en el sitio, arrastra cada fila desde los puntitos de la izquierda.";

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

/** Marca a la que pertenece una ficha (servicios, equipo, testimonios). */
export const brandField = (defaultValue: "arpad" | "kormos" | "aracena" = "arpad"): Field => ({
  name: "brand",
  label: "Marca",
  type: "select",
  required: true,
  defaultValue,
  index: true,
  options: [
    { label: "Arpad Studio", value: "arpad" },
    { label: "Kormós", value: "kormos" },
    { label: "Aracena Studio", value: "aracena" },
  ],
  admin: { position: "sidebar" },
});
