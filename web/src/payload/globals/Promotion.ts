import type { GlobalConfig } from "payload";
import { anyone, signedIn } from "../access";
import { revalidateGlobal } from "../hooks";

/**
 * Promoción de lanzamiento: las primeras personas que confirman su suscripción
 * reciben por correo un cupón numerado. El sitio muestra los cupos que quedan.
 */
export const Promotion: GlobalConfig = {
  slug: "promocion",
  label: "Promoción de lanzamiento",
  admin: {
    group: "Ajustes",
    hideAPIURL: true,
    description:
      "Las primeras personas que se suscriben (y confirman su correo) reciben un cupón por correo. Para usarlo, envían la captura del cupón por WhatsApp con su pedido. En Contactos → Suscriptores se ve quién tiene cupón.",
  },
  access: { read: anyone, update: signedIn },
  versions: { max: 20 },
  hooks: revalidateGlobal(["promocion"]),
  fields: [
    {
      name: "active",
      label: "Promoción activa",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Desmarcada, el aviso desaparece del sitio y no se entregan más cupones." },
    },
    {
      type: "row",
      fields: [
        { name: "percent", label: "Descuento (%)", type: "number", required: true, defaultValue: 15, min: 1, max: 100, admin: { width: "50%" } },
        { name: "slots", label: "Cupos", type: "number", required: true, defaultValue: 10, min: 1, admin: { width: "50%", description: "Cuántas personas reciben cupón." } },
      ],
    },
    {
      name: "terms",
      label: "Condiciones",
      type: "textarea",
      localized: true,
      defaultValue: "Válido en todas las piezas de Kormós. Se puede sumar a otras ofertas y no vence.",
      admin: { description: "Aparecen en el cupón y debajo del aviso del sitio." },
    },
    {
      name: "status",
      type: "ui",
      admin: { components: { Field: "/payload/admin/PromotionStatus#PromotionStatus" } },
    },
  ],
};
