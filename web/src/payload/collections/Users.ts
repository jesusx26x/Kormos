import type { CollectionConfig } from "payload";
import { signedIn } from "../access";

export const Users: CollectionConfig = {
  slug: "usuarios",
  labels: { singular: "Usuario", plural: "Usuarios" },
  auth: { tokenExpiration: 60 * 60 * 12 },
  admin: {
    useAsTitle: "email",
    group: "Ajustes",
    defaultColumns: ["name", "email"],
  },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  fields: [{ name: "name", label: "Nombre", type: "text" }],
};
