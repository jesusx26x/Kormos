// Correos del sitio: aviso de novedades y confirmación de suscripción.
// HTML de tablas con estilos en línea: es lo que leen bien Gmail y Outlook.

import type { Payload } from "payload";
import { BRANDS, type BrandSlug } from "@/lib/brands";
import { whatsappUrl } from "@/lib/whatsapp";

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** El correo funciona solo con la clave del proveedor y un remitente del dominio. */
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

/**
 * Remitente con el nombre de la marca y "responder a" el correo que la marca
 * tiene en el panel: Resend solo envía, así que una respuesta a la dirección
 * del sitio se perdería. Sin marca, las respuestas van al correo de Arpad.
 */
export async function brandSender(payload: Payload, brand?: BrandSlug | null): Promise<{ from?: string; replyTo?: string }> {
  const info = await payload.findGlobal({ slug: "marcas", depth: 0 }).catch(() => null);
  const replyTo = info?.[brand ?? "arpad"]?.email || undefined;
  const address = process.env.EMAIL_FROM;
  return { from: brand && address ? `"${BRANDS[brand].name}" <${address}>` : undefined, replyTo };
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Layout = { kicker: string; title: string; image?: string | null; body: string; button: { label: string; url: string }; footer: string };

function layoutHtml(l: Layout) {
  const img = l.image ? `<img src="${escape(l.image)}" alt="" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;margin:0 0 24px">` : "";
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f6f3ee;font-family:Helvetica,Arial,sans-serif;color:#1e1b18">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="padding:32px 32px 8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#6e675e">${escape(l.kicker)}</td></tr>
<tr><td style="padding:0 32px 16px;font-size:28px;line-height:1.2">${escape(l.title)}</td></tr>
<tr><td style="padding:0 32px">${img}</td></tr>
<tr><td style="padding:0 32px 24px;font-size:16px;line-height:1.6;color:#4a443d">${escape(l.body)}</td></tr>
<tr><td style="padding:0 32px 32px"><a href="${escape(l.button.url)}" style="display:inline-block;padding:14px 24px;background:#1e1b18;color:#f6f3ee;text-decoration:none;font-size:14px;letter-spacing:1px">${escape(l.button.label)}</a></td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.6;color:#6e675e">${l.footer}</p>
</td></tr></table></body></html>`;
}

export type Notice = { brand: string; kicker: string; title: string; summary: string; url: string; image: string | null };

/** Aviso de una pieza o un proyecto nuevo, con el enlace personal de baja. */
export function noticeEmail(n: Notice, token: string) {
  const unsubscribeUrl = `${SITE}/baja?t=${encodeURIComponent(token)}`;
  return {
    subject: `${n.kicker} en ${n.brand}: ${n.title}`,
    html: layoutHtml({
      kicker: `${n.brand} · ${n.kicker}`,
      title: n.title,
      image: n.image,
      body: n.summary,
      button: { label: "Verlo en el sitio", url: n.url },
      footer: `Recibes este correo porque te suscribiste a las novedades de Aracena Studio, Arpad Studio y Kormós. <a href="${escape(unsubscribeUrl)}" style="color:#6e675e">Darme de baja</a>.`,
    }),
    text: `${n.brand} · ${n.kicker}\n\n${n.title}\n\n${n.summary}\n\nVerlo en el sitio: ${n.url}\n\n—\nPara dejar de recibir estos correos: ${unsubscribeUrl}`,
  };
}

/** Confirmación de la suscripción (doble confirmación: nadie recibe avisos sin pedirlos). */
export function confirmEmail(token: string, promo?: { percent: number; slots: number } | null) {
  const confirmUrl = `${SITE}/confirmar?t=${encodeURIComponent(token)}`;
  // El cupón se entrega al confirmar: quien no pulsa el botón no ocupa un cupo
  const promoLine = promo
    ? ` Al confirmar, si estás entre las primeras ${promo.slots} personas, te enviamos tu cupón de ${promo.percent} % de descuento.`
    : "";
  return {
    subject: "Confirma tu suscripción a las novedades",
    html: layoutHtml({
      kicker: "Aracena Studio · Arpad Studio · Kormós",
      title: "Confirma tu suscripción",
      body: `Pulsa el botón para empezar a recibir los avisos de piezas y proyectos nuevos.${promoLine} Si no fuiste tú, ignora este correo: no te escribiremos más.`,
      button: { label: "Confirmar mi suscripción", url: confirmUrl },
      footer: "Recibes este correo porque alguien escribió esta dirección en el formulario de novedades del sitio.",
    }),
    text: `Confirma tu suscripción a las novedades de Aracena Studio, Arpad Studio y Kormós:\n${confirmUrl}\n${promoLine ? `\n${promoLine.trim()}\n` : ""}\nSi no fuiste tú, ignora este correo: no te escribiremos más.`,
  };
}

/** "jesus@gmail.com" → "j••••@gmail.com": el cupón se comparte en una captura. */
const maskEmail = (email: string) => {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 1)}${"•".repeat(Math.min(Math.max(user.length - 1, 3), 6))}@${domain}`;
};

export type CouponInfo = { number: number; slots: number; percent: number; code: string; email: string; terms?: string | null };

/**
 * Cupón de la promoción de lanzamiento. Quien lo recibe le toma una captura y
 * la envía por WhatsApp con su pedido: el número y el código se comparan con
 * el panel (Suscriptores).
 */
export function couponEmail(c: CouponInfo) {
  const terms = c.terms?.trim() || "";
  const catalog = `${SITE}/kormos/catalogo`;
  const wa = whatsappUrl("kormos", `Quiero usar mi cupón de ${c.percent} % de la promoción de lanzamiento (cupón ${c.number} de ${c.slots}). Les adjunto la captura.`);
  const steps = ["Tómale una captura a este cupón.", "Elige tus piezas en grupoarpad.com/kormos.", "Envía tu pedido por WhatsApp junto con la captura y te aplicamos el descuento."];
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#f6f3ee;font-family:Helvetica,Arial,sans-serif;color:#1e1b18">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="padding:32px 32px 8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#6e675e">Kormós · Promoción de lanzamiento</td></tr>
<tr><td style="padding:0 32px 24px;font-size:28px;line-height:1.2">Tu cupón de ${c.percent} % de descuento</td></tr>
<tr><td style="padding:0 32px 24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1e1b18;color:#f6f3ee">
<tr><td align="center" style="padding:28px 24px 4px;font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#cfc4b6">Cupón ${c.number} de ${c.slots}</td></tr>
<tr><td align="center" style="padding:0 24px;font-size:72px;line-height:1.1;font-weight:300">${c.percent} %</td></tr>
<tr><td align="center" style="padding:0 24px 16px;font-size:14px;letter-spacing:3px;text-transform:uppercase">de descuento</td></tr>
<tr><td align="center" style="padding:16px 24px 28px;border-top:1px solid #4a443d;font-size:13px;line-height:1.7;color:#cfc4b6">Código de verificación: <strong style="color:#f6f3ee;letter-spacing:3px">${escape(c.code)}</strong><br>A nombre de ${escape(maskEmail(c.email))}</td></tr>
</table></td></tr>
<tr><td style="padding:0 32px 8px;font-size:16px;line-height:1.6;color:#4a443d">Gracias por suscribirte: estás entre las primeras ${c.slots} personas y este cupón es tuyo. Para usarlo:</td></tr>
<tr><td style="padding:0 32px 16px;font-size:16px;line-height:1.6;color:#4a443d"><ol style="margin:0;padding-left:20px">${steps.map((s) => `<li>${escape(s)}</li>`).join("")}</ol></td></tr>
${terms ? `<tr><td style="padding:0 32px 24px;font-size:13px;line-height:1.6;color:#6e675e">${escape(terms)}</td></tr>` : ""}
<tr><td style="padding:0 32px 32px"><a href="${escape(catalog)}" style="display:inline-block;padding:14px 24px;background:#1e1b18;color:#f6f3ee;text-decoration:none;font-size:14px;letter-spacing:1px">Ver la colección</a>
&nbsp; <a href="${escape(wa)}" style="display:inline-block;padding:14px 4px;color:#1e1b18;font-size:14px;letter-spacing:1px">Escribir por WhatsApp</a></td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.6;color:#6e675e">Recibes este cupón porque confirmaste tu suscripción a las novedades de Aracena Studio, Arpad Studio y Kormós.</p>
</td></tr></table></body></html>`;
  return {
    subject: `Tu cupón de ${c.percent} % de descuento en Kormós`,
    html,
    text: [
      `KORMÓS · PROMOCIÓN DE LANZAMIENTO`,
      ``,
      `Tu cupón de ${c.percent} % de descuento`,
      `Cupón ${c.number} de ${c.slots} · Código de verificación: ${c.code} · A nombre de ${maskEmail(c.email)}`,
      ``,
      `Para usarlo:`,
      ...steps.map((s, i) => `${i + 1}. ${s}`),
      ...(terms ? [``, terms] : []),
      ``,
      `Ver la colección: ${catalog}`,
    ].join("\n"),
  };
}
