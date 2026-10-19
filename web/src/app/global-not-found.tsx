import type { Metadata } from "next";
import NotFound from "./(site)/not-found";
import { FONT_VARIABLES } from "./fonts";
import "./(site)/globals.css";

// Con varios layouts raíz (sitio y panel), las URL que no existen no pasan
// por ningún layout: esta página trae su propio <html>, estilos y fuentes.
export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="es" className={FONT_VARIABLES}>
      <body>
        <NotFound />
      </body>
    </html>
  );
}
