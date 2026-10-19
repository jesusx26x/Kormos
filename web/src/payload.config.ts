import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
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
    meta: { titleSuffix: " · Panel del sitio" },
    dateFormat: "d 'de' MMMM yyyy, HH:mm",
  },
  collections: [Products, Categories, Finishes, Projects, Packages, Services, Team, Testimonials, Media, Files, Users],
  globals: [AracenaFaq, ArpadProcess, BrandInfo],
  i18n: { supportedLanguages: { es }, fallbackLanguage: "es" },
  // Textos traducibles desde ya: para el sitio en inglés basta con añadir
  // { label: "English", code: "en" } y traducir en el panel.
  localization: {
    locales: [{ label: "Español", code: "es" }],
    defaultLocale: "es",
    fallback: true,
  },
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
