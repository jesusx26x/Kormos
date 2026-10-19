"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { BrandSlug } from "@/lib/brands";
import { whatsappUrl } from "@/lib/whatsapp";
import { IconWhatsApp } from "./Icons";
import styles from "./WhatsAppFloat.module.css";

/** Secciones que ya traen su propio botón de WhatsApp: el flotante les cede el sitio. */
const OWN_CTA = "[data-wa-hide], #contacto";
/** Fracción de la sección que debe verse para considerarla "en pantalla" */
const SHOWN = 0.3;

export function WhatsAppFloat({ brand }: { brand: BrandSlug }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const inView = new Set<Element>();
    const watched = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= SHOWN) inView.add(e.target);
          else inView.delete(e.target);
        }
        setHidden(inView.size > 0);
      },
      { threshold: [0, SHOWN] },
    );

    // La página nueva puede llegar un instante después de cambiar la ruta
    const scan = () => {
      document.querySelectorAll(OWN_CTA).forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById("contenido") ?? document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      setHidden(false);
    };
  }, [pathname]);

  return (
    // aside: el botón queda dentro de una región (landmark) para lectores de pantalla.
    // El fundido va aquí y no en el enlace: su animación de entrada (forwards) pisaría la opacidad.
    <aside aria-label="Contacto rápido" className={styles.wrap} data-hidden={hidden || undefined} aria-hidden={hidden || undefined} inert={hidden}>
      <a className={styles.float} href={whatsappUrl(brand)} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
        <IconWhatsApp size={24} />
      </a>
    </aside>
  );
}
