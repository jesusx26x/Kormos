"use client";

import { useId, useState } from "react";
import { waBlock, whatsappUrl } from "@/lib/whatsapp";
import { IconWhatsApp } from "./Icons";
import styles from "./BriefForm.module.css";

const TIPOS = ["Residencial", "Comercial", "Hotelero / turístico", "Desarrollo inmobiliario", "Otro"];
const PLAZOS = ["Sin prisa", "En 2 a 4 semanas", "Lo antes posible"];

/**
 * Arma la solicitud de render y la envía por WhatsApp (sin servidor).
 * Pide lo que Aracena necesita para cotizar: tipo, escala y plazo
 * ("no manejamos presupuestos genéricos").
 */
export function BriefForm({ packages }: { packages: string[] }) {
  const id = useId();
  const [error, setError] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    if (!get("paquete")) {
      setError(true);
      e.currentTarget.querySelector<HTMLSelectElement>("select[name=paquete]")?.focus();
      return;
    }
    setError(false);
    const url = whatsappUrl(
      "aracena",
      waBlock("Solicitud de render", [
        ["Paquete", get("paquete")],
        ["Tipo de proyecto", get("tipo")],
        ["Escala", get("escala")],
        ["Plazo", get("plazo")],
        ["Detalle", get("detalle")],
      ]),
      waBlock("Mis datos", [
        ["Nombre", get("nombre")],
        ["Empresa o estudio", get("empresa")],
      ]),
    );
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor={`${id}-paquete`}>Paquete *</label>
        <select id={`${id}-paquete`} name="paquete" defaultValue="" aria-invalid={error || undefined} aria-describedby={error ? `${id}-error` : undefined} onChange={() => setError(false)}>
          <option value="" disabled>
            Elige un paquete
          </option>
          {packages.map((p) => (
            <option key={p}>{p}</option>
          ))}
          <option>Aún no lo sé</option>
        </select>
        {error ? (
          <p id={`${id}-error`} className={styles.error} role="alert">
            Elige un paquete (o «Aún no lo sé»).
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-tipo`}>Tipo de proyecto</label>
        <select id={`${id}-tipo`} name="tipo" defaultValue={TIPOS[0]}>
          {TIPOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-escala`}>Escala</label>
        <input id={`${id}-escala`} name="escala" type="text" placeholder="Ej.: 3 ambientes, una fachada, 250 m²" autoComplete="off" />
      </div>

      <fieldset className={styles.field}>
        <legend>Plazo</legend>
        <div className={styles.options}>
          {PLAZOS.map((p, i) => (
            <label key={p} className={styles.option}>
              <input type="radio" name="plazo" value={p} defaultChecked={i === 0} />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={`${styles.field} ${styles.wide}`}>
        <label htmlFor={`${id}-detalle`}>Cuéntanos del proyecto</label>
        <textarea id={`${id}-detalle`} name="detalle" rows={3} placeholder="Qué quieres comunicar, estilo, referencias…" />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-nombre`}>Nombre</label>
        <input id={`${id}-nombre`} name="nombre" type="text" autoComplete="name" />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-empresa`}>Empresa o estudio</label>
        <input id={`${id}-empresa`} name="empresa" type="text" autoComplete="organization" />
      </div>

      <div className={`${styles.wide} ${styles.actions}`}>
        <button type="submit" className="btn">
          <IconWhatsApp size={16} /> Enviar solicitud por WhatsApp
        </button>
        <p className={styles.note}>Se abrirá WhatsApp con tu solicitud ya escrita. Puedes adjuntar planos o referencias en el chat.</p>
      </div>
    </form>
  );
}
