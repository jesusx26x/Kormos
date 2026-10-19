"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { cart, cartDrawer } from "@/lib/cart";
import { whatsappUrl } from "@/lib/whatsapp";
import { IconBag, IconCheck, IconDownload, IconWhatsApp } from "../Icons";
import type { MediaInfo, VariantInfo } from "./catalogData";
import styles from "./Kormos.module.css";

type Files = { skp?: string; dwg?: string; pdf?: string };

type ProductViewProps = {
  slug: string;
  code: string;
  name: string;
  category: string;
  summary: string;
  price: string;
  status: string;
  statusLabel: string;
  images: MediaInfo[];
  variantLabel: string;
  variants: VariantInfo[];
  dims: string | null;
  dimensionsNote: string;
  files: Files;
};

const FORMATS: { key: keyof Files; label: string; desc: string }[] = [
  { key: "skp", label: "SketchUp", desc: ".skp · modelo 3D" },
  { key: "dwg", label: "AutoCAD", desc: ".dwg · planos 2D" },
  { key: "pdf", label: "Ficha técnica", desc: ".pdf" },
];

/**
 * Ficha de producto (parte interactiva): galería que cambia con el acabado,
 * selector de acabado (radios nativos), "Agregar a mi selección" con
 * confirmación en el propio botón, consulta de disponibilidad y descargas.
 */
export function ProductView(p: ProductViewProps) {
  const [variantId, setVariantId] = useState(p.variants[0]?.id);
  const [shot, setShot] = useState(0);
  const [added, setAdded] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const timer = useRef<number>(0);
  const id = useId();

  const variant = p.variants.find((v) => v.id === variantId);
  const gallery = variant?.images?.length ? variant.images : p.images;
  const current = gallery[Math.min(shot, gallery.length - 1)];
  const hasOwnPhotos = !!variant?.images?.length;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function add() {
    cart.add(p.slug, variantId);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1800);
  }

  const variantText = variant ? `, ${p.variantLabel.toLowerCase()} ${variant.name}` : "";
  const askAvailability = whatsappUrl("kormos", `¿Está disponible la pieza ${p.name}${variantText} (${p.code})?`);
  const askQuote = whatsappUrl("kormos", `Descargué los archivos de ${p.name} (${p.code}) y me gustaría saber cuánto cuesta${variantText}.`);
  const anyFile = FORMATS.some((f) => p.files[f.key]);

  return (
    <div className={styles.product}>
      {/* ---- Galería ---- */}
      <div className={styles.gallery}>
        <div className={styles.stage} data-cutout={current.cutout || undefined}>
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 959px) 100vw, 55vw"
            quality={85}
            loading="eager"
            fetchPriority="high"
            placeholder={current.blurDataURL ? "blur" : "empty"}
            blurDataURL={current.blurDataURL ?? undefined}
            className={`${current.cutout ? styles.contain : styles.cover} ${styles.swap}`}
          />
          {variant && !hasOwnPhotos ? (
            <span className={styles.stageNote}>
              <span className={styles.noteSwatch} style={variant.swatch.src ? { backgroundImage: `url(${variant.swatch.src})` } : { background: variant.swatch.hex }} />
              Foto de referencia · se fabrica en {variant.name.toLowerCase()}
            </span>
          ) : null}
        </div>
        {gallery.length > 1 ? (
          <div className={styles.thumbs} role="group" aria-label="Fotos">
            {gallery.map((m, i) => (
              <button key={m.src} type="button" className={styles.thumb} aria-pressed={i === shot} aria-label={`Ver foto ${i + 1}: ${m.alt}`} onClick={() => setShot(i)}>
                <Image src={m.src} alt="" fill sizes="96px" className={m.cutout ? styles.contain : styles.cover} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* ---- Información y acciones ---- */}
      <div className={styles.info}>
        <p className={styles.infoCat}>
          {p.category} · {p.code}
        </p>
        <h1 className={`display ${styles.infoName}`}>{p.name}</h1>
        <p className={styles.infoSummary}>{p.summary}</p>

        <div className={styles.infoRow}>
          <p className={styles.infoPrice}>{p.price}</p>
          <span className={styles.badgeInline} data-status={p.status}>
            {p.statusLabel}
          </span>
        </div>

        {p.variants.length ? (
          <fieldset className={styles.variants}>
            <legend>
              {p.variantLabel}: <strong>{variant?.name}</strong>
            </legend>
            <div className={styles.swatches}>
              {p.variants.map((v) => (
                <label key={v.id} className={styles.swatch} title={v.name}>
                  <input
                    type="radio"
                    name={`${id}-variante`}
                    value={v.id}
                    checked={v.id === variantId}
                    onChange={() => {
                      setVariantId(v.id);
                      setShot(0);
                    }}
                  />
                  <span className={styles.swatchChip} style={v.swatch.src ? { backgroundImage: `url(${v.swatch.src})` } : { background: v.swatch.hex }} />
                  <span className="visually-hidden">{v.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <dl className={styles.specs}>
          <div>
            <dt>Medidas {p.dims ? "(alto × ancho × fondo)" : null}</dt>
            <dd>
              {p.dims ? (
                <>
                  {p.dims}
                  <span className={styles.muted}> · {p.dimensionsNote}</span>
                </>
              ) : (
                p.dimensionsNote
              )}
            </dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <button type="button" className={`btn ${styles.addButton}`} data-added={added || undefined} onClick={add}>
            <span className={styles.addLabel} aria-hidden={added}>
              <IconBag size={16} /> Agregar a mi selección
            </span>
            <span className={styles.addDone} aria-hidden={!added}>
              <IconCheck size={16} /> Agregada
            </span>
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => cartDrawer.set(true)}>
            Ver mi selección
          </button>
          <p className="visually-hidden" role="status" aria-live="polite">
            {added ? `${p.name} agregada a tu selección.` : ""}
          </p>
        </div>

        <a className={`link-arrow ${styles.ask}`} href={askAvailability} target="_blank" rel="noopener noreferrer">
          <IconWhatsApp size={14} /> Consultar disponibilidad
        </a>

        {/* ---- Descargas libres ---- */}
        <section className={styles.downloads} aria-labelledby={`${id}-dl`}>
          <h2 id={`${id}-dl`} className="eyebrow">
            Archivos para tu proyecto
          </h2>
          <ul>
            {FORMATS.map((f) => {
              const file = p.files[f.key];
              return (
                <li key={f.key} className={styles.file}>
                  <span>
                    <span className={styles.fileName}>{f.label}</span>
                    <span className={styles.fileDesc}>{f.desc}</span>
                  </span>
                  {file ? (
                    <a className={styles.fileAction} href={file} download onClick={() => setDownloaded(true)}>
                      <IconDownload size={16} /> Descargar
                    </a>
                  ) : (
                    <a
                      className={styles.fileAction}
                      href={whatsappUrl("kormos", `Quisiera el archivo ${f.label} (${f.desc}) de ${p.name} (${p.code}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pedir por WhatsApp
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <p className={styles.muted}>
            {anyFile ? "Descarga libre para diseñar tu espacio." : "Los archivos de esta pieza se están preparando; pídelos por WhatsApp y te los enviamos."}
          </p>
          {downloaded ? (
            <div className={styles.afterDownload} role="status">
              <p>¿Quieres saber cuánto cuesta esta pieza?</p>
              <a className="link-arrow" href={askQuote} target="_blank" rel="noopener noreferrer">
                Cotizar por WhatsApp
              </a>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
