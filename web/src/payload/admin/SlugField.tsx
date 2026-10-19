"use client";

import { TextField, useDocumentInfo } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import { useState } from "react";
import styles from "./admin.module.css";

/**
 * Enlace de la ficha: oculto al crear y bloqueado una vez guardado, para no romper por descuido
 * los enlaces ya compartidos. Se puede desbloquear si de verdad hace falta
 * (p. ej. una copia que se quedó con "-copia").
 */
export function SlugField(props: TextFieldClientProps) {
  const { id } = useDocumentInfo();
  const [locked, setLocked] = useState(true);
  // En una ficha nueva todavía no hay enlace: se crea al guardar a partir del nombre
  if (!id) return null;
  return (
    <div className={styles.slugField}>
      <TextField {...props} readOnly={props.readOnly || locked} />
      {locked && !props.readOnly ? (
        <button type="button" className={styles.slugUnlock} onClick={() => setLocked(false)}>
          Cambiar el enlace
        </button>
      ) : null}
    </div>
  );
}
