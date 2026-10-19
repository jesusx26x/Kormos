"use client";

import { useId, useState } from "react";
import { waBlock, whatsappUrl } from "@/lib/whatsapp";
import { IconWhatsApp } from "../Icons";
import styles from "../BriefForm.module.css";

// Lo que Kormós fabrica a medida (catálogo, pág. 19)
const PIEZAS = ["Mueble de TV", "Mesa de comedor", "Sillas", "Mobiliario de baño", "Cocina modular", "Mueble de bar", "Coffee bar", "Mesa de noche o auxiliar", "Otra pieza"];
const MADERAS = ["Aún no lo sé", "Nogal", "Roble", "Roble brasileño", "Teka", "Caoba", "Cedro", "Pino tratado", "Congona", "MDF Jequitibá", "MDF laminado", "Melamina", "MDF hidrófugo"];

/** Brief de Atelier: arma la descripción de la pieza y la envía por WhatsApp. */
export function AtelierForm() {
  const id = useId();
  const [error, setError] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    if (!get("pieza")) {
      setError(true);
      e.currentTarget.querySelector<HTMLSelectElement>("select[name=pieza]")?.focus();
      return;
    }
    setError(false);
    const medidas = [get("alto") && `alto ${get("alto")} cm`, get("ancho") && `ancho ${get("ancho")} cm`, get("fondo") && `fondo ${get("fondo")} cm`].filter(Boolean).join(", ");
    const url = whatsappUrl(
      "kormos",
      waBlock("Pieza a medida (Atelier)", [
        ["Pieza", get("pieza")],
        ["Medidas aproximadas", medidas],
        ["Madera", get("madera")],
        ["Acabado o color", get("acabado")],
        ["Espacio", get("espacio")],
        ["Presupuesto aproximado", get("presupuesto")],
      ]),
      waBlock("Mis datos", [["Nombre", get("nombre")]]),
    );
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor={`${id}-pieza`}>¿Qué pieza imaginas? *</label>
        <select id={`${id}-pieza`} name="pieza" defaultValue="" aria-invalid={error || undefined} aria-describedby={error ? `${id}-error` : undefined} onChange={() => setError(false)}>
          <option value="" disabled>
            Elige un tipo de pieza
          </option>
          {PIEZAS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        {error ? (
          <p id={`${id}-error`} className={styles.error} role="alert">
            Cuéntanos qué tipo de pieza necesitas.
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-madera`}>Madera</label>
        <select id={`${id}-madera`} name="madera" defaultValue={MADERAS[0]}>
          {MADERAS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <fieldset className={`${styles.field} ${styles.wide}`}>
        <legend>Medidas aproximadas (cm)</legend>
        <div className={styles.dims}>
          {[
            ["alto", "Alto"],
            ["ancho", "Ancho"],
            ["fondo", "Fondo"],
          ].map(([name, label]) => (
            <label key={name} className={styles.dim}>
              <span>{label}</span>
              <input name={name} type="text" inputMode="decimal" autoComplete="off" placeholder="—" />
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={`${id}-acabado`}>Acabado o color</label>
        <input id={`${id}-acabado`} name="acabado" type="text" placeholder="Ej.: nogal natural, laca verde olivo" />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-presupuesto`}>Presupuesto aproximado (opcional)</label>
        <input id={`${id}-presupuesto`} name="presupuesto" type="text" placeholder="RD$ o US$" />
      </div>

      <div className={`${styles.field} ${styles.wide}`}>
        <label htmlFor={`${id}-espacio`}>Cuéntanos del espacio</label>
        <textarea id={`${id}-espacio`} name="espacio" rows={3} placeholder="Dónde irá la pieza, estilo del espacio, referencias…" />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-nombre`}>Nombre</label>
        <input id={`${id}-nombre`} name="nombre" type="text" autoComplete="name" />
      </div>

      <div className={`${styles.wide} ${styles.actions}`}>
        <button type="submit" className="btn">
          <IconWhatsApp size={16} /> Enviar mi idea por WhatsApp
        </button>
        <p className={styles.note}>Puedes adjuntar fotos del espacio o referencias directamente en el chat.</p>
      </div>
    </form>
  );
}
