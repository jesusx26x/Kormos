import type { Field, PayloadHandler } from "payload";
import type { Foto, Producto, Proyecto } from "@/payload-types";
import { brandSender, emailConfigured, noticeEmail, SITE, type Notice } from "./emails";

const BRAND_NAMES = { arpad: "Arpad Studio", kormos: "Kormós", aracena: "Aracena Studio" } as const;
// Resend admite unos 2 envíos por segundo en su plan inicial
const PAUSE_MS = 600;

const photoUrl = (value: unknown): string | null => {
  const f = Array.isArray(value) ? value[0] : value;
  const url = f && typeof f === "object" ? (f as Foto).url : null;
  if (!url) return null;
  // Publicada, la foto ya es una URL completa de Vercel Blob
  return /^https?:\/\//.test(url) ? url : `${SITE}${url}`;
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
    const sender = await brandSender(req.payload, collection === "productos" ? "kormos" : (doc as Proyecto).brand);
    let sent = 0;
    let failed = 0;
    for (const s of subscribers) {
      try {
        await req.payload.sendEmail({ to: s.email, ...sender, ...noticeEmail(notice, s.token ?? "") });
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
