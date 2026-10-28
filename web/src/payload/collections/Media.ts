import path from "node:path";
import sharp from "sharp";
import type { CollectionConfig } from "payload";
import { anyone, signedIn } from "../access";
import { blockDeleteIfPhotoUsed, revalidateCollection } from "../hooks";
import { guardUpload } from "../storage";

/**
 * Fotos de productos, acabados y proyectos. Al subir una foto se calcula su
 * difuminado de carga y se detecta si es un recorte con fondo transparente
 * (las piezas recortadas se muestran enteras sobre fondo claro).
 */
export const Media: CollectionConfig = {
  slug: "fotos",
  labels: { singular: "Foto", plural: "Fotos" },
  admin: {
    group: "Biblioteca",
    hideAPIURL: true,
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "filesize", "updatedAt"],
    components: { beforeListTable: ["/payload/admin/StorageMeter#StorageNotice"] },
    description: "Fotos en JPG, PNG o WebP. Para piezas recortadas usa PNG o WebP con fondo transparente. Las fotos muy grandes se reducen solas al subirlas.",
  },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  upload: {
    // Relativo a web/ (el build mueve este archivo: no se usa import.meta.url)
    staticDir: path.resolve(process.cwd(), "uploads/fotos"),
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    // Una foto de celular o un render pesa de 4 a 15 MB; el sitio nunca la muestra
    // a más de 2560 px. Mismo formato: la versión reducida reemplaza al original
    // en Blob y no queda una copia ocupando espacio.
    resizeOptions: { width: 2560, height: 2560, fit: "inside", withoutEnlargement: true },
    // La imagen para compartir (1200×630) se genera bajo demanda: ver app/compartir
    adminThumbnail: ({ doc }) => (typeof doc.url === "string" ? doc.url : null),
  },
  hooks: {
    beforeOperation: [guardUpload],
    beforeChange: [
      async ({ data, req }) => {
        // Con subida directa a Blob el servidor recibe un archivo temporal, no los bytes
        const file = req.file?.tempFilePath ?? (req.file?.data?.length ? req.file.data : null);
        if (!file) return data;
        const image = sharp(file);
        const meta = await image.metadata();
        const blur = await sharp(file).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
        data.blurDataURL = `data:image/webp;base64,${blur.toString("base64")}`;
        if (meta.hasAlpha) {
          const stats = await sharp(file).stats();
          data.cutout = (stats.channels[3]?.min ?? 255) < 250;
        } else {
          data.cutout = false;
        }
        return data;
      },
    ],
    ...revalidateCollection(["catalogo", "proyectos", "paquetes", "fotos", "servicios", "equipo"]),
    beforeDelete: [blockDeleteIfPhotoUsed],
  },
  fields: [
    // Campo propio de las subidas: solo se cambia cómo se ve en la lista
    { name: "filesize", label: "Tamaño del archivo", type: "number", admin: { components: { Cell: "/payload/admin/cells#FileSizeCell" } } },
    {
      name: "alt",
      label: "Descripción de la foto",
      type: "text",
      localized: true,
      admin: {
        description: 'Qué se ve, en una frase. La leen los buscadores y los lectores de pantalla. Ej.: "Mesa de noche en nogal junto a una cama". Si la dejas vacía, se usa el nombre del archivo.',
      },
      hooks: {
        // Al subir muchas fotos a la vez no hace falta describir cada una para guardar
        beforeValidate: [
          ({ value, data, req }) => {
            if (typeof value === "string" && value.trim()) return value;
            const name = req.file?.name ?? data?.filename;
            if (typeof name !== "string") return value;
            const text = name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").replace(/\s+\d+$/, "").trim();
            return text ? text[0].toUpperCase() + text.slice(1) : value;
          },
        ],
      },
    },
    {
      name: "cutout",
      label: "Recorte con fondo transparente",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Se detecta al subir la foto. Los recortes se muestran enteros sobre fondo claro." },
    },
    { name: "blurDataURL", type: "text", admin: { hidden: true } },
  ],
};
