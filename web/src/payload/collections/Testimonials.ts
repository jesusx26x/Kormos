import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { brandField, publishedField } from "../fields";
import { revalidateCollection } from "../hooks";

/** Testimonios de clientes. Solo se publican testimonios reales y con permiso del cliente. */
export const Testimonials: CollectionConfig = {
  slug: "testimonios",
  labels: { singular: "Testimonio", plural: "Testimonios" },
  orderable: true,
  defaultSort: "_order",
  admin: {
    group: "Arpad y Aracena",
    useAsTitle: "author",
    defaultColumns: ["author", "brand", "published"],
    description: "Lo que dicen los clientes. Aparecen en la página Estudio; si no hay ninguno, la sección no se muestra.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: revalidateCollection(["testimonios"]),
  fields: [
    {
      name: "quote",
      label: "Testimonio",
      type: "textarea",
      required: true,
      localized: true,
      maxLength: 400,
      admin: { rows: 4, description: "Las palabras del cliente, sin comillas." },
    },
    {
      type: "row",
      fields: [
        { name: "author", label: "Cliente", type: "text", required: true, admin: { width: "50%", description: 'Ej.: "María G."' } },
        { name: "detail", label: "Detalle", type: "text", localized: true, admin: { width: "50%", description: 'Opcional. Ej.: "Villa en Punta Cana"' } },
      ],
    },
    {
      name: "project",
      label: "Proyecto relacionado",
      type: "relationship",
      relationTo: "proyectos",
      admin: { description: "Opcional. Añade un enlace al proyecto." },
    },
    brandField(),
    publishedField,
  ],
};
