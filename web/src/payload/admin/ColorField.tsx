"use client";

import { TextInput, useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import styles from "./admin.module.css";

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

// El selector del navegador solo entiende #rrggbb: "#abc" se pasa a "#aabbcc"
function toPicker(value: string) {
  if (!HEX.test(value)) return "#8a6a4f";
  const v = value.toLowerCase();
  return v.length === 4 ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v;
}

/** Color del acabado: se escribe el código o se elige en la paleta; se guarda el mismo texto. */
export function ColorField({ field, path: pathFromProps, readOnly }: TextFieldClientProps) {
  const { value, setValue, showError, path, disabled, customComponents } = useField<string>({ potentiallyStalePath: pathFromProps });
  const text = typeof value === "string" ? value : "";
  const locked = readOnly || disabled;

  return (
    <TextInput
      className={styles.colorField}
      path={path}
      label={field.label}
      description={field.admin?.description}
      required={field.required}
      localized={field.localized}
      readOnly={locked}
      showError={showError}
      value={text}
      onChange={(e) => setValue(e.target.value)}
      Label={customComponents?.Label}
      Description={customComponents?.Description}
      Error={customComponents?.Error}
      BeforeInput={
        <input
          type="color"
          className={styles.colorPicker}
          value={toPicker(text)}
          disabled={locked}
          aria-label="Elegir el color en la paleta"
          onChange={(e) => setValue(e.target.value)}
        />
      }
    />
  );
}
