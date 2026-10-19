import path from "node:path";
import { APIError, type CollectionConfig } from "payload";
import { anyone, signedIn } from "../access";
import { revalidateCollection } from "../hooks";

const FORMATS = ["skp", "dwg", "pdf"] as const;

/** Archivos de descarga libre de cada pieza: SketchUp, AutoCAD y ficha técnica. */
export const Files: CollectionConfig = {
  slug: "archivos",
  labels: { singular: "Archivo", plural: "Archivos 3D y fichas" },
  admin: {
    group: "Biblioteca",
    hideAPIURL: true,
    useAsTitle: "filename",
    defaultColumns: ["filename", "format", "filesize", "updatedAt"],
    description: "Modelos SketchUp (.skp), planos AutoCAD (.dwg) y fichas técnicas (.pdf). Se descargan libremente desde la ficha de cada pieza.",
  },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  upload: {
    staticDir: path.resolve(process.cwd(), "uploads/archivos"),
    // Los navegadores no reconocen el tipo de un .skp ni de un .dwg y la subida
    // directa a Blob rechaza un archivo sin tipo. La extensión se valida abajo.
    allowRestrictedFileTypes: true,
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        const name = req.file?.name ?? data?.filename;
        if (!name || !data) return data;
        const ext = path.extname(name).slice(1).toLowerCase();
        if (!(FORMATS as readonly string[]).includes(ext)) {
          // 400 con mensaje visible en el panel (no un error del servidor)
          throw new APIError("Solo se aceptan archivos .skp, .dwg o .pdf.", 400, null, true);
        }
        data.format = ext;
        return data;
      },
    ],
    ...revalidateCollection(["catalogo"]),
  },
  fields: [
    {
      name: "format",
      label: "Formato",
      type: "select",
      options: [
        { label: "SketchUp (.skp)", value: "skp" },
        { label: "AutoCAD (.dwg)", value: "dwg" },
        { label: "Ficha técnica (.pdf)", value: "pdf" },
      ],
      admin: { readOnly: true, position: "sidebar", description: "Se detecta por la extensión del archivo." },
    },
  ],
};
