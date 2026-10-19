"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Brand } from "@/lib/brands";
import { whatsappUrl } from "@/lib/whatsapp";
import { BrandLockup } from "./BrandLockup";
import { IconArrow, IconClose, IconMenu, IconWhatsApp } from "./Icons";
import { Logo } from "./Logo";
import { CartButton } from "./kormos/CartButton";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps = {
  brand: Brand;
  others: Brand[];
};

export function SiteHeader({ brand, others }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMenuLink = useRef<HTMLAnchorElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Los enlaces a una sección (#) no marcan página actual
  const isCurrent = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  // Fondo sólido al bajar del hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: bloquea el scroll, Escape cierra y devuelve el foco al botón
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMenuLink.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Popover del grupo: clic fuera o Escape lo cierran
  useEffect(() => {
    if (!groupOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!groupRef.current?.contains(e.target as Node)) setGroupOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setGroupOpen(false);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [groupOpen]);

  const close = () => setMenuOpen(false);
  const solid = scrolled || menuOpen;

  return (
    <header className={styles.header} data-solid={solid || undefined} data-menu={menuOpen || undefined}>
      <div className={styles.bar}>
        <Link href={`/${brand.slug}`} className={styles.brand} aria-label={`${brand.name}, inicio`} onClick={close}>
          <BrandLockup brand={brand} />
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          <ul>
            {brand.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <div className={styles.group} ref={groupRef}>
            <button
              type="button"
              className={styles.groupButton}
              aria-expanded={groupOpen}
              aria-controls="grupo-popover"
              onClick={() => setGroupOpen((o) => !o)}
            >
              Grupo
              <span className={styles.chevron} aria-hidden="true" />
            </button>
            <div id="grupo-popover" className={styles.popover} data-open={groupOpen || undefined}>
              <p className={styles.popoverTitle}>Diseño que se visualiza, se ejecuta y se materializa</p>
              <ul>
                {others.map((b) => (
                  <li key={b.slug}>
                    <Link href={`/${b.slug}`} scroll={false} className={styles.popoverLink} onClick={() => setGroupOpen(false)} tabIndex={groupOpen ? 0 : -1}>
                      <Logo name={b.monogram} className={styles.popoverMark} />
                      <span>
                        <span className={styles.popoverName}>{b.name}</span>
                        <span className={styles.popoverDesc}>{b.descriptor}</span>
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/" scroll={false} className={styles.popoverHome} onClick={() => setGroupOpen(false)} tabIndex={groupOpen ? 0 : -1}>
                    Volver a la portada <IconArrow size={14} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <a className={`btn ${styles.cta}`} href={whatsappUrl(brand.slug)} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp size={16} />
            <span className={styles.ctaText}>{brand.ctaLabel}</span>
          </a>

          {brand.slug === "kormos" ? <CartButton /> : null}

          <button
            ref={menuButton}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? "Cerrar el menú" : "Abrir el menú"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      <div id="menu-movil" className={styles.sheet} data-open={menuOpen || undefined} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav aria-label="Menú" className={styles.sheetNav}>
          <ul>
            {brand.nav.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <Link
                  ref={i === 0 ? firstMenuLink : undefined}
                  href={item.href}
                  className={`display ${styles.sheetLink}`}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={close}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.sheetGroup}>
          <p className="eyebrow">Grupo</p>
          <ul>
            {others.map((b) => (
              <li key={b.slug}>
                <Link href={`/${b.slug}`} scroll={false} className={styles.sheetBrand} onClick={close}>
                  <Logo name={b.monogram} className={styles.popoverMark} />
                  <span>
                    <span className={styles.popoverName}>{b.name}</span>
                    <span className={styles.popoverDesc}>{b.descriptor}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/" scroll={false} className="link-arrow" onClick={close}>
            Portada
          </Link>
        </div>
      </div>
    </header>
  );
}
