import "server-only";
import crypto from "node:crypto";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import type { Payload } from "payload";
import type { Suscriptore } from "@/payload-types";
import { brandSender, couponEmail, emailConfigured } from "@/payload/emails";
import { cms } from "./payload";

export type Promotion = { percent: number; slots: number; given: number; remaining: number; terms: string | null };

const COUNT_WHERE = { couponNumber: { exists: true } } as const;

/** La promoción activa con los cupos que quedan, o null si no hay ninguna. */
export async function getPromotion(): Promise<Promotion | null> {
  "use cache";
  cacheLife("max");
  cacheTag("promocion");

  const payload = await cms();
  const promo = await payload.findGlobal({ slug: "promocion", depth: 0 });
  if (!promo.active) return null;
  const { totalDocs: given } = await payload.count({ collection: "suscriptores", where: COUNT_WHERE, overrideAccess: true });
  return { percent: promo.percent, slots: promo.slots, given, remaining: Math.max(0, promo.slots - given), terms: promo.terms?.trim() || null };
}

/** Seis caracteres que salen del enlace personal: no se pueden adivinar ni copiar de otro cupón. */
const couponCode = (token: string) => crypto.createHash("sha256").update(`${token}:cupon`).digest("hex").slice(0, 6).toUpperCase();

export type Coupon = { number: number; slots: number; percent: number };

/**
 * Entrega el siguiente cupón a quien acaba de confirmar su suscripción y se lo
 * manda por correo. El número es único en la base: si dos personas confirman a
 * la vez, la segunda toma el siguiente.
 */
export async function grantCoupon(payload: Payload, sub: Suscriptore): Promise<Coupon | null> {
  const promo = await payload.findGlobal({ slug: "promocion", depth: 0 });
  if (!promo.active || !sub.token) return null;

  let owner = sub.couponNumber ? sub : null;
  for (let attempt = 0; !owner && attempt < 3; attempt++) {
    const { totalDocs: given } = await payload.count({ collection: "suscriptores", where: COUNT_WHERE, overrideAccess: true });
    if (given >= promo.slots) return null;
    owner = await payload
      .update({ collection: "suscriptores", id: sub.id, data: { couponNumber: given + 1, couponCode: couponCode(sub.token) }, overrideAccess: true })
      .catch(() => null);
  }
  if (!owner?.couponNumber) return null;
  try {
    revalidateTag("promocion", { expire: 0 });
  } catch {
    // Fuera de una petición de Next no hay caché que invalidar
  }

  const coupon = { number: owner.couponNumber, slots: promo.slots, percent: promo.percent };
  if (emailConfigured() && !owner.couponSentAt) {
    try {
      await payload.sendEmail({
        to: owner.email,
        ...(await brandSender(payload, "kormos")),
        ...couponEmail({ ...coupon, code: owner.couponCode ?? couponCode(sub.token), email: owner.email, terms: promo.terms }),
      });
      await payload.update({ collection: "suscriptores", id: sub.id, data: { couponSentAt: new Date().toISOString() }, overrideAccess: true });
    } catch (err) {
      // El cupón queda asignado; el correo se reintenta si vuelve a confirmar
      console.error("Correo del cupón fallido", err);
    }
  }
  return coupon;
}
