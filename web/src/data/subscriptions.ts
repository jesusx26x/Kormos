"use server";

import type { BrandSlug } from "@/lib/brands";
import { cms } from "./payload";

export type SubscribeState = { status: "idle" | "ok" | "error"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BRANDS: BrandSlug[] = ["arpad", "kormos", "aracena"];

/**
 * Guarda el correo del pie del sitio. Si ya estaba, responde igual (no revela
 * quién está suscrito); si se había dado de baja, lo reactiva.
 */
export async function subscribe(_prev: SubscribeState, form: FormData): Promise<SubscribeState> {
  // Campo trampa: las personas no lo ven, los robots lo llenan
  if (String(form.get("sitio_web") ?? "")) return { status: "ok", message: "¡Listo! Te avisaremos cuando haya novedades." };

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) return { status: "error", message: "Escribe un correo válido, por ejemplo nombre@correo.com." };
  const brandValue = String(form.get("brand") ?? "");
  const brand = BRANDS.includes(brandValue as BrandSlug) ? (brandValue as BrandSlug) : undefined;

  try {
    const payload = await cms();
    const { docs } = await payload.find({ collection: "suscriptores", where: { email: { equals: email } }, limit: 1, overrideAccess: true });
    const existing = docs[0];
    if (!existing) {
      await payload.create({ collection: "suscriptores", data: { email, brand, status: "activo" }, overrideAccess: true });
    } else if (existing.status === "baja") {
      await payload.update({ collection: "suscriptores", id: existing.id, data: { status: "activo" }, overrideAccess: true });
    }
    return { status: "ok", message: "¡Listo! Te avisaremos cuando haya novedades." };
  } catch (err) {
    console.error("Suscripción fallida", err);
    return { status: "error", message: "No pudimos guardar tu correo. Inténtalo de nuevo en un momento." };
  }
}

export type UnsubscribeState = { status: "idle" | "ok" | "error" };

/** Baja desde el enlace del correo (se confirma con un botón: los lectores de correo abren los enlaces solos). */
export async function unsubscribe(_prev: UnsubscribeState, form: FormData): Promise<UnsubscribeState> {
  const token = String(form.get("token") ?? "");
  if (!token) return { status: "error" };
  try {
    const payload = await cms();
    const { docs } = await payload.find({ collection: "suscriptores", where: { token: { equals: token } }, limit: 1, overrideAccess: true });
    if (!docs[0]) return { status: "error" };
    if (docs[0].status !== "baja") {
      await payload.update({ collection: "suscriptores", id: docs[0].id, data: { status: "baja" }, overrideAccess: true });
    }
    return { status: "ok" };
  } catch (err) {
    console.error("Baja fallida", err);
    return { status: "error" };
  }
}
