// Sin dependencias de servidor: también lo usa el panel en el navegador

/**
 * Espacio del plan Hobby de Vercel Blob. Al pasarse, Vercel bloquea las subidas
 * (y puede dejar de servir fotos) hasta el mes siguiente, sin aviso previo: por
 * eso el panel avisa antes y deja de aceptar archivos con margen.
 */
export const STORAGE_LIMIT = 1_000_000_000;
export const STORAGE_WARN = 0.7;
export const STORAGE_BLOCK = 0.9;
/** Un solo modelo de SketchUp puede comerse buena parte del espacio y de las descargas del mes */
export const MAX_UPLOAD_BYTES = 75 * 1024 * 1024;

export type StorageLevel = "ok" | "warn" | "full";
export type StorageUsage = { used: number; limit: number; ratio: number; level: StorageLevel };

export const STORAGE_FULL_MESSAGE =
  "El espacio para fotos y archivos está casi lleno. Para subir más, borra fotos o archivos que ya no se usen, o pide a quien administra el sitio que lo amplíe.";

export const tooBigMessage = (bytes: number) =>
  `Este archivo pesa ${Math.round(bytes / 1024 / 1024)} MB y el máximo es 75 MB. Guárdalo más liviano e inténtalo de nuevo.`;
