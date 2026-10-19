import crypto from "node:crypto";
import type { CollectionConfig, PayloadHandler } from "payload";
import { signedIn } from "../access";

const BRAND_NAMES = { arpad: "Arpad Studio", kormos: "Kormós", aracena: "Aracena Studio" } as const;
const STATUS_NAMES = { pendiente: "Por confirmar", activo: "Activo", baja: "De baja" } as const;
// Día en República Dominicana: con la fecha UTC, quien se suscribe de noche salía al día siguiente
const drDay = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santo_Domingo" });
const day = (iso?: string | null) => (iso ? drDay.format(new Date(iso)) : "");

/** Lista en CSV (se abre en Excel) con los suscriptores activos y los dados de baja. */
const exportCsv: PayloadHandler = async (req) => {
  if (!req.user) return Response.json({ message: "Inicia sesión en el panel." }, { status: 401 });
  const { docs } = await req.payload.find({ collection: "suscriptores", limit: 0, pagination: false, sort: "createdAt", req });
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["Correo", "Desde", "Estado", "Fecha de suscripción", "Fecha de baja"],
    ...docs.map((d) => [d.email, d.brand ? BRAND_NAMES[d.brand] : "", STATUS_NAMES[d.status], day(d.createdAt), day(d.unsubscribedAt)]),
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
    description:
      "Correos que dejaron en el pie del sitio. Solo reciben avisos los activos: quien se suscribe confirma desde un correo, y quien se da de baja no recibe más.",
    components: {
      beforeListTable: [
        "/payload/admin/ExportButton#ExportButton",
        {
          path: "/payload/admin/QuickFilters#QuickFilters",
          clientProps: {
            filters: [
              { label: "Todos" },
              { label: "Activos", where: { status: "activo" } },
              { label: "Por confirmar", where: { status: "pendiente" } },
              { label: "De baja", where: { status: "baja" } },
            ],
          },
        },
      ],
    },
  },
  // Sin "Agregar" en el panel: un alta a mano se saltaría la confirmación por
  // correo. El formulario del sitio crea con overrideAccess y no le afecta.
  access: { read: signedIn, create: () => false, update: signedIn, delete: signedIn },
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
        if (data.status && data.status !== "baja" && originalDoc?.status === "baja") data.unsubscribedAt = null;
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
      // El formulario del sitio guarda "pendiente" de forma explícita. Aquí sigue
      // "activo" porque cambiar el valor por defecto obliga a SQLite a rehacer la
      // tabla y el ajuste automático en local falla
      defaultValue: "activo",
      index: true,
      options: [
        { label: "Por confirmar", value: "pendiente" },
        { label: "Activo", value: "activo" },
        { label: "De baja", value: "baja" },
      ],
      admin: { position: "sidebar", description: "Por confirmar: todavía no pulsó el botón del correo de confirmación." },
    },
    { name: "unsubscribedAt", label: "Fecha de baja", type: "date", admin: { position: "sidebar", readOnly: true } },
    // Último correo de confirmación: evita reenviarlo cada vez que alguien repite el formulario
    { name: "confirmationSentAt", type: "date", admin: { hidden: true } },
    // Enlace personal para confirmar y para darse de baja desde el correo
    { name: "token", type: "text", unique: true, index: true, admin: { hidden: true } },
  ],
};
