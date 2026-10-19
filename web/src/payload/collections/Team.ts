import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { brandField, previewField, publishedField } from "../fields";
import { revalidateCollection } from "../hooks";

/** Equipo de cada marca (hoy lo muestra la página Estudio de Arpad). */
export const Team: CollectionConfig = {
  slug: "equipo",
  labels: { singular: "Persona del equipo", plural: "Equipo" },
  orderable: true,
  defaultSort: "_order",
  admin: {
    group: "Arpad y Aracena",
    useAsTitle: "name",
    defaultColumns: ["preview", "role", "brand", "published"],
    hideAPIURL: true,
    description: "Personas que aparecen en la página Estudio. Publica nombres y fotos solo con su permiso.",
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: revalidateCollection(["equipo"]),
  fields: [
    { name: "name", label: "Nombre", type: "text", required: true, admin: { description: 'Ej.: "Arq. Beamel P."' } },
    { name: "role", label: "Cargo", type: "text", required: true, localized: true, admin: { description: 'Ej.: "Arquitectura · Diseño y ejecución"' } },
    {
      name: "photo",
      label: "Foto",
      type: "upload",
      relationTo: "fotos",
      admin: { description: "Opcional. Sin foto se muestran las iniciales del nombre." },
    },
    previewField("Persona"),
    brandField(),
    publishedField,
  ],
};
