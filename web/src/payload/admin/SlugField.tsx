"use client";

import { TextField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import { useState } from "react";
import styles from "./admin.module.css";

/**
 * Enlace de la ficha: bloqueado una vez guardado, para no romper por descuido
 * los enlaces ya compartidos. Se puede desbloquear si de verdad hace falta
 * (p. ej. una copia que se quedó con "-copia").
 */
export function SlugField(props: TextFieldClientProps) {
  const [locked, setLocked] = useState(true);
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
