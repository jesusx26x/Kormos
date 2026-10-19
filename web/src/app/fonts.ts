import { Cormorant_Garamond, Jost, Marcellus, Montserrat } from "next/font/google";

// Compartidas por el layout del sitio, la página 404 global y el panel
// (cada layout raíz carga sus propias fuentes).

// Sans fina y espaciada (Kormós, texto base de todo el sitio)
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400", "500"] });
// Serif editorial (titulares de Arpad)
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  // Solo la usa Arpad: no se precarga en todas las páginas
  preload: false,
});
// Serif clásica en mayúsculas (Aracena)
const marcellus = Marcellus({ variable: "--font-marcellus", subsets: ["latin"], weight: "400", preload: false });
// Sans humanista (texto del logotipo de Arpad)
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400", "500"], preload: false });

export const FONT_VARIABLES = `${jost.variable} ${cormorant.variable} ${marcellus.variable} ${montserrat.variable}`;
