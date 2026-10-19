import type { CollectionConfig } from "payload";
import { publishedOrSignedIn, signedIn } from "../access";
import { paragraphsField, previewField, priceFields, publishedField, quickFilters, readyField, slugField } from "../fields";
import { revalidateCollection } from "../hooks";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const fileField = (name: string, label: string, format: "skp" | "dwg" | "pdf") => ({
  name,
  label,
  type: "upload" as const,
  relationTo: "archivos" as const,
  filterOptions: { format: { equals: format } },
});

/** Piezas del catálogo de Kormós. */
export const Products: CollectionConfig = {
  slug: "productos",
  labels: { singular: "Producto", plural: "Productos" },
  orderable: true,
  defaultSort: "_order",
  admin: {
    group: "Kormós",
    useAsTitle: "name",
    defaultColumns: ["preview", "code", "category", "status", "published"],
    listSearchableFields: ["name", "code"],
    description: "Piezas del catálogo. Arrastra las filas para cambiar el orden en el que aparecen.",
    hideAPIURL: true,
    components: {
      beforeListTable: quickFilters([
        { label: "Disponibles", where: { status: "disponible" } },
        { label: "Bajo pedido", where: { status: "bajo_pedido" } },
        { label: "Próximamente", where: { status: "proximamente" } },
        { label: "Agotadas", where: { status: "agotado" } },
      ]),
    },
    preview: (doc) => (doc?.slug ? `${SITE}/kormos/catalogo/${doc.slug}` : null),
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: revalidateCollection(["catalogo"]),
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Pieza",
          fields: [
            {
              type: "row",
              fields: [
                { name: "name", label: "Nombre", type: "text", required: true, localized: true, admin: { width: "60%" } },
                { name: "code", label: "Código", type: "text", required: true, unique: true, admin: { width: "40%", description: "Ej.: KR-MN-04" } },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "category", label: "Categoría", type: "relationship", relationTo: "categorias", required: true, admin: { width: "50%" } },
                {
                  name: "collection",
                  label: "Colección",
                  type: "text",
                  required: true,
                  localized: true,
                  defaultValue: "Colección Origen",
                  admin: { width: "50%", description: '"Colección Origen" o "A medida", por ejemplo.' },
                },
              ],
            },
            {
              name: "summary",
              label: "Resumen",
              type: "textarea",
              required: true,
              localized: true,
              maxLength: 200,
              admin: { rows: 2, description: "Una frase. Aparece bajo el nombre y al compartir el enlace por WhatsApp." },
            },
            paragraphsField("description", "Descripción"),
          ],
        },
        {
          label: "Fotos y acabados",
          fields: [
            {
              name: "images",
              label: "Fotos",
              type: "upload",
              relationTo: "fotos",
              hasMany: true,
              required: true,
              minRows: 1,
              admin: { description: "La primera es la principal (catálogo, carrito y enlace compartido)." },
            },
            {
              name: "variantLabel",
              label: "Nombre del selector",
              type: "text",
              localized: true,
              defaultValue: "Madera",
              admin: { description: 'Qué elige el cliente: "Madera", "Tapizado", "Color"…' },
            },
            {
              name: "variants",
              label: "Acabados disponibles",
              labels: { singular: "Acabado", plural: "Acabados" },
              type: "array",
              admin: {
                description: "Si un acabado no tiene fotos propias, la ficha muestra las fotos generales con una nota del acabado elegido.",
                initCollapsed: true,
              },
              fields: [
                { name: "finish", label: "Acabado", type: "relationship", relationTo: "acabados", required: true },
                { name: "images", label: "Fotos en este acabado", type: "upload", relationTo: "fotos", hasMany: true },
              ],
            },
          ],
        },
        {
          label: "Medidas y materiales",
          fields: [
            {
              type: "row",
              fields: [
                { name: "height", label: "Alto (cm)", type: "number", min: 0, admin: { width: "33%" } },
                { name: "width", label: "Ancho (cm)", type: "number", min: 0, admin: { width: "33%" } },
                { name: "depth", label: "Fondo (cm)", type: "number", min: 0, admin: { width: "33%" } },
              ],
            },
            {
              name: "dimensionsNote",
              label: "Nota de medidas",
              type: "text",
              localized: true,
              defaultValue: "Medidas estándar. También se fabrica a la medida de tu espacio.",
            },
            {
              name: "materials",
              label: "Materiales",
              labels: { singular: "Material", plural: "Materiales" },
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", label: "Concepto", type: "text", required: true, localized: true, admin: { width: "40%", description: 'Ej.: "Estructura"' } },
                    { name: "value", label: "Detalle", type: "text", required: true, localized: true, admin: { width: "60%", description: 'Ej.: "Madera de pino"' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Precio y estado",
          fields: [
            ...priceFields,
            {
              name: "status",
              label: "Estado",
              type: "select",
              required: true,
              defaultValue: "bajo_pedido",
              options: [
                { label: "Disponible", value: "disponible" },
                { label: "Bajo pedido", value: "bajo_pedido" },
                { label: "Próximamente", value: "proximamente" },
                { label: "Agotado", value: "agotado" },
              ],
              admin: {
                description: "Nunca se muestran cantidades: el cliente consulta la disponibilidad por WhatsApp.",
                components: { Cell: "/payload/admin/cells#StatusCell" },
              },
            },
          ],
        },
        {
          label: "Archivos",
          description: "Descarga libre desde la ficha. Si falta alguno, la ficha ofrece pedirlo por WhatsApp.",
          fields: [
            fileField("fileSkp", "SketchUp (.skp)", "skp"),
            fileField("fileDwg", "AutoCAD (.dwg)", "dwg"),
            fileField("filePdf", "Ficha técnica (.pdf)", "pdf"),
          ],
        },
      ],
    },
    readyField,
    previewField("Pieza"),
    slugField("name"),
    publishedField,
  ],
};
