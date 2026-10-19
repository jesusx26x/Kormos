import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { resendAdapter } from "@payloadcms/email-resend";
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
 * Panel de contenido (/admin). En local usa SQLite (web/data/); al publicar
 * se cambia el adaptador por PostgreSQL y el almacenamiento de archivos por
 * uno en la nube (ver ANALISIS-Y-PLAN.md, fase 8).
 */
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
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI ?? "file:./data/sitio.db" },
  }),
  upload: {
    // Los modelos de SketchUp pueden pesar bastante
    limits: { fileSize: 150 * 1024 * 1024 },
  },
  graphQL: { disable: true },
  telemetry: false,
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
