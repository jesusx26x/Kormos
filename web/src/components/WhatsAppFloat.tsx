import type { BrandSlug } from "@/lib/brands";
import { whatsappUrl } from "@/lib/whatsapp";
import { IconWhatsApp } from "./Icons";
import styles from "./WhatsAppFloat.module.css";

export function WhatsAppFloat({ brand }: { brand: BrandSlug }) {
  return (
    // aside: el botón queda dentro de una región (landmark) para lectores de pantalla
    <aside aria-label="Contacto rápido">
      <a className={styles.float} href={whatsappUrl(brand)} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
        <IconWhatsApp size={24} />
      </a>
    </aside>
  );
}
