import type { Field, PayloadHandler } from "payload";
import type { Foto, Producto, Proyecto } from "@/payload-types";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const BRAND_NAMES = { arpad: "Arpad Studio", kormos: "Kormós", aracena: "Aracena Studio" } as const;
// Resend admite unos 2 envíos por segundo en su plan inicial
const PAUSE_MS = 600;

/** El correo funciona solo con la clave del proveedor y un remitente del dominio. */
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Notice = { brand: string; kicker: string; title: string; summary: string; url: string; image: string | null };

function noticeHtml(n: Notice, unsubscribeUrl: string) {
  const img = n.image ? `<img src="${escape(n.image)}" alt="" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;margin:0 0 24px">` : "";
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f6f3ee;font-family:Helvetica,Arial,sans-serif;color:#1e1b18">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="padding:32px 32px 8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#6e675e">${escape(n.brand)} · ${escape(n.kicker)}</td></tr>
<tr><td style="padding:0 32px 16px;font-size:28px;line-height:1.2">${escape(n.title)}</td></tr>
<tr><td style="padding:0 32px">${img}</td></tr>
<tr><td style="padding:0 32px 24px;font-size:16px;line-height:1.6;color:#4a443d">${escape(n.summary)}</td></tr>
<tr><td style="padding:0 32px 32px"><a href="${escape(n.url)}" style="display:inline-block;padding:14px 24px;background:#1e1b18;color:#f6f3ee;text-decoration:none;font-size:14px;letter-spacing:1px">Verlo en el sitio</a></td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.6;color:#6e675e">Recibes este correo porque te suscribiste a las novedades de Aracena Studio, Arpad Studio y Kormós. <a href="${escape(unsubscribeUrl)}" style="color:#6e675e">Darme de baja</a>.</p>
</td></tr></table></body></html>`;
}

function noticeText(n: Notice, unsubscribeUrl: string) {
  return `${n.brand} · ${n.kicker}\n\n${n.title}\n\n${n.summary}\n\nVerlo en el sitio: ${n.url}\n\n—\nPara dejar de recibir estos correos: ${unsubscribeUrl}`;
}

const photoUrl = (value: unknown): string | null => {
  const f = Array.isArray(value) ? value[0] : value;
  return f && typeof f === "object" && typeof (f as Foto).url === "string" ? `${SITE}${(f as Foto).url}` : null;
};

function toNotice(collection: "productos" | "proyectos", doc: Producto | Proyecto): Notice {
  if (collection === "productos") {
    const p = doc as Producto;
    return { brand: "Kormós", kicker: "Nueva pieza", title: p.name, summary: p.summary, url: `${SITE}/kormos/catalogo/${p.slug}`, image: photoUrl(p.images) };
  }
  const p = doc as Proyecto;
  return { brand: BRAND_NAMES[p.brand], kicker: "Nuevo proyecto", title: p.title, summary: p.summary, url: `${SITE}/${p.brand}/proyectos/${p.slug}`, image: photoUrl(p.cover) };
}

/** Fecha del último aviso: evita mandar dos veces el mismo correo. */
export const notifiedAtField: Field = {
  name: "notifiedAt",
  label: "Aviso enviado",
  type: "date",
  admin: {
    position: "sidebar",
    readOnly: true,
    components: { Field: "/payload/admin/NotifyButton#NotifyButton" },
  },
};

/**
 * POST /api/<colección>/:id/avisar — manda el aviso de la pieza o el proyecto
 * a cada suscriptor activo, con su enlace personal de baja.
 */
export const notifyHandler =
  (collection: "productos" | "proyectos"): PayloadHandler =>
  async (req) => {
    if (!req.user) return Response.json({ message: "Inicia sesión en el panel." }, { status: 401 });
    if (!emailConfigured()) {
      return Response.json(
        { message: "El correo del sitio todavía no está configurado. Se activa al publicar el sitio (ver la guía de publicación)." },
        { status: 400 },
      );
    }
    const id = String(req.routeParams?.id ?? "");
    const doc = await req.payload.findByID({ collection, id, depth: 1, req }).catch(() => null);
    if (!doc) return Response.json({ message: "No se encontró la ficha." }, { status: 404 });
    if (!doc.published) return Response.json({ message: "La ficha está oculta: márcala como visible antes de avisar." }, { status: 400 });
    if (doc.notifiedAt) return Response.json({ message: "Ya se avisó de esta ficha. No se envía dos veces." }, { status: 409 });

    const { docs: subscribers } = await req.payload.find({
      collection: "suscriptores",
      where: { status: { equals: "activo" } },
      limit: 0,
      pagination: false,
      depth: 0,
      req,
    });
    if (subscribers.length === 0) return Response.json({ message: "Todavía no hay suscriptores activos." }, { status: 400 });

    // Se marca antes de enviar: si alguien pulsa dos veces, el segundo intento se detiene
    await req.payload.update({ collection, id, data: { notifiedAt: new Date().toISOString() }, req, context: { disableRevalidate: true } });

    const notice = toNotice(collection, doc);
    let sent = 0;
    let failed = 0;
    for (const s of subscribers) {
      const unsubscribeUrl = `${SITE}/baja?t=${encodeURIComponent(s.token ?? "")}`;
      try {
        await req.payload.sendEmail({
          to: s.email,
          subject: `${notice.kicker} en ${notice.brand}: ${notice.title}`,
          html: noticeHtml(notice, unsubscribeUrl),
          text: noticeText(notice, unsubscribeUrl),
        });
        sent++;
      } catch (err) {
        failed++;
        req.payload.logger.error({ err, to: s.email }, "Aviso por correo fallido");
      }
      await new Promise((r) => setTimeout(r, PAUSE_MS));
    }
    if (sent === 0) {
      // Nada salió (clave o remitente mal configurados): se puede volver a intentar
      await req.payload.update({ collection, id, data: { notifiedAt: null }, req, context: { disableRevalidate: true } });
      return Response.json({ message: "No se pudo enviar ningún correo. Revisa la configuración del correo e inténtalo de nuevo.", sent, failed }, { status: 502 });
    }
    return Response.json({ message: failed ? `Enviado a ${sent} suscriptores. ${failed} no se pudieron enviar.` : `Enviado a ${sent} suscriptores.`, sent, failed });
  };
