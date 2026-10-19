import type { Metadata, Viewport } from "next";
import { InlineScript } from "@/components/InlineScript";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { FONT_VARIABLES } from "../fonts";
import "./globals.css";

export const metadata: Metadata = {
  // Base para todas las URL absolutas (Open Graph, canonical). Ver src/lib/seo.ts
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s",
  },
  description:
    "Arquitectura, mobiliario a medida y visualización arquitectónica en República Dominicana. Diseño que se visualiza, se ejecuta y se materializa.",
  applicationName: SITE_NAME,
  formatDetection: { telephone: false },
  openGraph: {
    siteName: SITE_NAME,
    locale: "es_DO",
    type: "website",
    images: [{ url: "/og/og-portada.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e1b18",
};

// Antes del primer pintado: activa los estilos que dependen de JS y
// salta la animación de entrada si ya se vio en esta sesión.
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('intro-visto'))d.dataset.intro='visto'}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={FONT_VARIABLES}
      suppressHydrationWarning
    >
      <body>
        <InlineScript html={BOOT_SCRIPT} />
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
