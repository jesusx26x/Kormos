/**
 * Fechas del panel en un solo formato ("19 de octubre de 2026, 14:30") y con la
 * hora de República Dominicana, aunque el servidor o el navegador estén en otra zona.
 */
const dateTime = new Intl.DateTimeFormat("es-DO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "America/Santo_Domingo",
});

// Intl pone "a las" entre fecha y hora; el resto del panel (admin.dateFormat) usa coma
export const formatDateTime = (value: string | Date) =>
  dateTime
    .formatToParts(new Date(value))
    .map((p) => (p.type === "literal" && /a las/.test(p.value) ? ", " : p.value))
    .join("");
