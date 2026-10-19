import type { CollectionConfig } from "payload";
import { signedIn } from "../access";
import { blockDeleteOwnOrLastUser } from "../hooks";

export const Users: CollectionConfig = {
  slug: "usuarios",
  labels: { singular: "Usuario", plural: "Usuarios" },
  auth: { tokenExpiration: 60 * 60 * 12 },
  admin: {
    useAsTitle: "email",
    group: "Ajustes",
    hideAPIURL: true,
    defaultColumns: ["name", "email"],
  },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: { beforeDelete: [blockDeleteOwnOrLastUser] },
  fields: [{ name: "name", label: "Nombre", type: "text", admin: { description: "El nombre con el que te saluda el inicio del panel." } }],
};
