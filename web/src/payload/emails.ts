// Correos del sitio: aviso de novedades y confirmación de suscripción.
// HTML de tablas con estilos en línea: es lo que leen bien Gmail y Outlook.

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** El correo funciona solo con la clave del proveedor y un remitente del dominio. */
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

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
export function confirmEmail(token: string) {
  const confirmUrl = `${SITE}/confirmar?t=${encodeURIComponent(token)}`;
  return {
    subject: "Confirma tu suscripción a las novedades",
    html: layoutHtml({
      kicker: "Aracena Studio · Arpad Studio · Kormós",
      title: "Confirma tu suscripción",
      body: "Pulsa el botón para empezar a recibir los avisos de piezas y proyectos nuevos. Si no fuiste tú, ignora este correo: no te escribiremos más.",
      button: { label: "Confirmar mi suscripción", url: confirmUrl },
      footer: "Recibes este correo porque alguien escribió esta dirección en el formulario de novedades del sitio.",
    }),
    text: `Confirma tu suscripción a las novedades de Aracena Studio, Arpad Studio y Kormós:\n${confirmUrl}\n\nSi no fuiste tú, ignora este correo: no te escribiremos más.`,
  };
}
