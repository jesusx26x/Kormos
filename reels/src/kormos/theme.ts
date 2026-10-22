import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Colores y letra de Kormós en el sitio (globals.css, tema "kormos")
export const C = {
  bg: "#EBE5DB",
  surface: "#F4F0E9",
  text: "#2E2A25",
  muted: "#5D554B",
  wood: "#64402A",
  dark: "#1E1B18",
  cream: "#F6F3EE",
};

export const FONT = "Jost";

// Solo el subconjunto latino: trae las letras con tilde, la ñ y los signos del español.
// Cargar también el latino extendido sin rango hacía que la "Á" saliera separada de su tilde.
export const fontsReady = loadFont({ family: FONT, url: staticFile("fonts/jost-latin.woff2"), weight: "100 900" });

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Ancho de la pantalla del celular en el video; las capturas son de 390 px CSS a 3x
export const SCREEN_W = 600;
export const CSS_W = 390;
export const K = SCREEN_W / CSS_W;
export const VIEW_H = 844;
