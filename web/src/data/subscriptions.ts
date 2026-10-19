"use server";

import type { BrandSlug } from "@/lib/brands";
import { confirmEmail, emailConfigured } from "@/payload/emails";
import { cms } from "./payload";

export type SubscribeState = { status: "idle" | "ok" | "error"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BRANDS: BrandSlug[] = ["arpad", "kormos", "aracena"];
// No se reenvía la confirmación más de una vez cada 10 minutos al mismo correo
const RESEND_AFTER_MS = 10 * 60 * 1000;
const OK: SubscribeState = { status: "ok", message: "¡Gracias! Te enviamos un correo: confirma la suscripción desde ahí." };

/**
 * Guarda el correo del pie del sitio como "por confirmar" y manda el correo de
 * confirmación: nadie recibe avisos por haber escrito su dirección otra persona.
 * Responde siempre igual para no revelar quién está suscrito.
 */
export async function subscribe(_prev: SubscribeState, form: FormData): Promise<SubscribeState> {
  // Campo trampa: las personas no lo ven, los robots lo llenan
  if (String(form.get("sitio_web") ?? "")) return OK;

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) return { status: "error", message: "Escribe un correo válido, por ejemplo nombre@correo.com." };
  const brandValue = String(form.get("brand") ?? "");
  const brand = BRANDS.includes(brandValue as BrandSlug) ? (brandValue as BrandSlug) : undefined;

  try {
    const payload = await cms();
    const { docs } = await payload.find({ collection: "suscriptores", where: { email: { equals: email } }, limit: 1, overrideAccess: true });
    let sub = docs[0];
    if (sub?.status === "activo") return OK;
    if (!sub) {
      sub = await payload.create({ collection: "suscriptores", data: { email, brand, status: "pendiente" }, overrideAccess: true });
    } else if (sub.status === "baja") {
      // Volver después de darse de baja pide confirmar otra vez
      sub = await payload.update({ collection: "suscriptores", id: sub.id, data: { status: "pendiente" }, overrideAccess: true });
    }

    const lastSent = sub.confirmationSentAt ? Date.parse(sub.confirmationSentAt) : 0;
    if (emailConfigured() && sub.token && Date.now() - lastSent > RESEND_AFTER_MS) {
      try {
        await payload.sendEmail({ to: email, ...confirmEmail(sub.token) });
        await payload.update({ collection: "suscriptores", id: sub.id, data: { confirmationSentAt: new Date().toISOString() }, overrideAccess: true });
      } catch (err) {
        // El correo quedó guardado; la confirmación se reintenta si vuelve a suscribirse
        console.error("Correo de confirmación fallido", err);
      }
    }
    return OK;
  } catch (err) {
    console.error("Suscripción fallida", err);
    return { status: "error", message: "No pudimos guardar tu correo. Inténtalo de nuevo en un momento." };
  }
}

export type TokenState = { status: "idle" | "ok" | "error" };

async function setStatusByToken(form: FormData, status: "activo" | "baja"): Promise<TokenState> {
  const token = String(form.get("token") ?? "");
  if (!token) return { status: "error" };
  try {
    const payload = await cms();
    const { docs } = await payload.find({ collection: "suscriptores", where: { token: { equals: token } }, limit: 1, overrideAccess: true });
    const sub = docs[0];
    if (!sub) return { status: "error" };
    // Confirmar un correo que ya se dio de baja no lo reactiva: tiene que suscribirse otra vez
    if (status === "activo" && sub.status === "baja") return { status: "error" };
    if (sub.status !== status) await payload.update({ collection: "suscriptores", id: sub.id, data: { status }, overrideAccess: true });
    return { status: "ok" };
  } catch (err) {
    console.error("Cambio de suscripción fallido", err);
    return { status: "error" };
  }
}

/** Confirmación desde el correo (con botón: los lectores de correo abren los enlaces solos). */
export async function confirmSubscription(_prev: TokenState, form: FormData): Promise<TokenState> {
  return setStatusByToken(form, "activo");
}

/** Baja desde el enlace del correo. */
export async function unsubscribe(_prev: TokenState, form: FormData): Promise<TokenState> {
  return setStatusByToken(form, "baja");
}
