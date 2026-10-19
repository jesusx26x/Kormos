import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { resendAdapter } from "@payloadcms/email-resend";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { es } from "@payloadcms/translations/languages/es";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Categories } from "./payload/collections/Categories";
import { Files } from "./payload/collections/Files";
import { Finishes } from "./payload/collections/Finishes";
import { Media } from "./payload/collections/Media";
import { Packages } from "./payload/collections/Packages";
import { Products } from "./payload/collections/Products";
import { Projects } from "./payload/collections/Projects";
import { Services } from "./payload/collections/Services";
import { Subscribers } from "./payload/collections/Subscribers";
import { Team } from "./payload/collections/Team";
import { Testimonials } from "./payload/collections/Testimonials";
import { Users } from "./payload/collections/Users";
import { AracenaFaq } from "./payload/globals/AracenaFaq";
import { ArpadProcess } from "./payload/globals/ArpadProcess";
import { BrandInfo } from "./payload/globals/BrandInfo";

const dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.PAYLOAD_SECRET) {
  throw new Error("Falta PAYLOAD_SECRET en web/.env (ver .env.example).");
}

/**
 * Panel de contenido (/admin). En local usa SQLite (web/data/) y guarda las
 * fotos y archivos en web/uploads/. Publicado (ver GUIA-DE-PUBLICACION.md):
 * una DATABASE_URL (o DATABASE_URI) postgres:// activa PostgreSQL y BLOB_READ_WRITE_TOKEN
 * guarda fotos y archivos en Vercel Blob.
 */
// Vercel guarda la base de Neon como DATABASE_URL: se acepta tal cual
const databaseUri = process.env.DATABASE_URI || process.env.DATABASE_URL || "file:./data/sitio.db";
const usePostgres = /^postgres(ql)?:\/\//.test(databaseUri);
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: " · Panel del sitio", icons: [{ rel: "icon", type: "image/png", url: "/icon.png" }] },
    dateFormat: "d 'de' MMMM yyyy, HH:mm",
    // Sin Gravatar: la foto de usuario se pedía a un servicio externo y salía rota
    avatar: "default",
    components: {
      graphics: { Logo: "/payload/admin/Brand#Logo", Icon: "/payload/admin/Brand#Icon" },
      beforeLogin: ["/payload/admin/Brand#LoginHelp"],
      views: { dashboard: { Component: "/payload/admin/Dashboard#Dashboard" } },
    },
  },
  collections: [Products, Categories, Finishes, Projects, Packages, Services, Team, Testimonials, Subscribers, Media, Files, Users],
  globals: [AracenaFaq, ArpadProcess, BrandInfo],
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: "es",
    // Confirmaciones que dicen qué pasa en el sitio
    translations: {
      es: {
        general: {
          // Sin {{label}}: "Categoría guardado" no concuerda en género
          successfullyCreated: "Listo, se guardó. Si está marcado como visible, ya aparece en el sitio.",
          updatedSuccessfully: "Guardado. El sitio ya muestra el cambio.",
          successfullyDeleted: "Se borró «{{label}}». Ya no aparece en el sitio.",
          untitled: "Nueva ficha",
        },
      },
    },
  },
  // Textos traducibles desde ya: para el sitio en inglés basta con añadir
  // { label: "English", code: "en" } y traducir en el panel.
  localization: {
    locales: [{ label: "Español", code: "es" }],
    defaultLocale: "es",
    fallback: true,
  },
  // Sin clave de Resend, Payload solo escribe los correos en la consola (ver notify.ts)
  email:
    process.env.RESEND_API_KEY && process.env.EMAIL_FROM
      ? resendAdapter({
          apiKey: process.env.RESEND_API_KEY,
          defaultFromAddress: process.env.EMAIL_FROM,
          defaultFromName: process.env.EMAIL_FROM_NAME ?? "Aracena Studio · Arpad Studio · Kormós",
        })
      : undefined,
  db: usePostgres
    ? postgresAdapter({
        pool: { connectionString: databaseUri },
        // En producción el esquema cambia solo con migraciones (npm run migrate)
        migrationDir: path.resolve(dirname, "migrations"),
      })
    : sqliteAdapter({ client: { url: databaseUri } }),
  plugins: blobToken
    ? [
        vercelBlobStorage({
          token: blobToken,
          // Las fotos y los .skp/.dwg/.pdf son públicos: se sirven directo desde Blob,
          // sin pasar por el servidor (un .skp puede pesar 150 MB)
          collections: { fotos: { disablePayloadAccessControl: true }, archivos: { disablePayloadAccessControl: true } },
          // Vercel limita a 4.5 MB lo que entra al servidor: el navegador sube directo a Blob
          clientUploads: true,
        }),
      ]
    : [],
  upload: {
    // Los modelos de SketchUp pueden pesar bastante
    limits: { fileSize: 150 * 1024 * 1024 },
  },
  graphQL: { disable: true },
  telemetry: false,
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
