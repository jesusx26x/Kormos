import crypto from "node:crypto";
import type { CollectionConfig, PayloadHandler } from "payload";
import { signedIn } from "../access";

const BRAND_NAMES = { arpad: "Arpad Studio", kormos: "Kormós", aracena: "Aracena Studio" } as const;

/** Lista en CSV (se abre en Excel) con los suscriptores activos y los dados de baja. */
const exportCsv: PayloadHandler = async (req) => {
  if (!req.user) return Response.json({ message: "Inicia sesión en el panel." }, { status: 401 });
  const { docs } = await req.payload.find({ collection: "suscriptores", limit: 0, pagination: false, sort: "createdAt", req });
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["Correo", "Desde", "Estado", "Fecha de suscripción", "Fecha de baja"],
    ...docs.map((d) => [d.email, d.brand ? BRAND_NAMES[d.brand] : "", d.status === "baja" ? "Baja" : "Activo", d.createdAt.slice(0, 10), d.unsubscribedAt?.slice(0, 10) ?? ""]),
  ];
  // BOM para que Excel lea bien las tildes
  const csv = "﻿" + rows.map((r) => r.map(cell).join(";")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="suscriptores.csv"',
    },
  });
};

/**
 * Personas que dejaron su correo en el pie del sitio. Se crean solo desde el
 * formulario (acción del servidor), nunca por la API pública.
 */
export const Subscribers: CollectionConfig = {
  slug: "suscriptores",
  labels: { singular: "Suscriptor", plural: "Suscriptores" },
  admin: {
    group: "Contactos",
    useAsTitle: "email",
    defaultColumns: ["email", "brand", "status", "createdAt"],
    hideAPIURL: true,
    description: "Correos que dejaron en el pie del sitio para recibir novedades. Quien se da de baja queda marcado y no recibe más avisos.",
    components: {
      beforeListTable: [
        "/payload/admin/ExportButton#ExportButton",
        {
          path: "/payload/admin/QuickFilters#QuickFilters",
          clientProps: { filters: [{ label: "Todos" }, { label: "Activos", where: { status: "activo" } }, { label: "De baja", where: { status: "baja" } }] },
        },
      ],
    },
  },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  endpoints: [{ path: "/exportar", method: "get", handler: exportCsv }],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.email) data.email = String(data.email).trim().toLowerCase();
        return data;
      },
    ],
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        if (operation === "create" && !data.token) data.token = crypto.randomBytes(24).toString("base64url");
        if (data.status === "baja" && originalDoc?.status !== "baja") data.unsubscribedAt = new Date().toISOString();
        if (data.status === "activo" && originalDoc?.status === "baja") data.unsubscribedAt = null;
        return data;
      },
    ],
  },
  fields: [
    { name: "email", label: "Correo", type: "email", required: true, unique: true, index: true },
    {
      name: "brand",
      label: "Desde",
      type: "select",
      options: [
        { label: "Arpad Studio", value: "arpad" },
        { label: "Kormós", value: "kormos" },
        { label: "Aracena Studio", value: "aracena" },
      ],
      admin: { description: "En qué parte del sitio se suscribió." },
    },
    {
      name: "status",
      label: "Estado",
      type: "select",
      required: true,
      defaultValue: "activo",
      index: true,
      options: [
        { label: "Activo", value: "activo" },
        { label: "De baja", value: "baja" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "unsubscribedAt", label: "Fecha de baja", type: "date", admin: { position: "sidebar", readOnly: true } },
    // Enlace personal para darse de baja desde el correo
    { name: "token", type: "text", unique: true, index: true, admin: { hidden: true } },
  ],
};
