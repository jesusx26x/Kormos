"use client";

import { TextField, useDocumentInfo, useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import { type RefObject, useEffect, useId, useRef, useState } from "react";
import styles from "./admin.module.css";

// "Colección  origen" y "Coleccion Origen" cuentan como la misma
const norm = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/**
 * Colección de la pieza: texto libre, pero con las colecciones que ya existen a
 * mano. Una falta de ortografía crearía otra colección en el catálogo sin que
 * nadie lo note, así que se avisa cuando el nombre es nuevo o casi igual a otro.
 */
export function CollectionField(props: TextFieldClientProps) {
  const { id } = useDocumentInfo();
  const { value, setValue } = useField<string>({ potentiallyStalePath: props.path });
  const [existing, setExisting] = useState<string[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    let alive = true;
    fetch("/api/productos?depth=0&pagination=false&select[collection]=true", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { docs?: { id: number | string; collection?: string | null }[] } | null) => {
        if (!alive || !d?.docs) return;
        // La pieza que se está editando no cuenta: si es la única de su colección, no es "nueva"
        const names = d.docs.filter((p) => String(p.id) !== String(id ?? "")).map((p) => p.collection?.trim() ?? "");
        setExisting([...new Set(names.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id]);

  // El campo de texto de Payload no acepta "list": se conecta a la lista de sugerencias aquí
  useEffect(() => {
    inputRef.current?.setAttribute("list", listId);
  }, [listId]);

  const current = typeof value === "string" ? value.trim() : "";
  const exact = existing?.includes(current);
  const similar = !exact && current ? existing?.find((e) => norm(e) === norm(current)) : undefined;
  const isNew = Boolean(existing?.length && current && !exact && !similar);
  const others = existing?.filter((e) => e !== current) ?? [];

  return (
    <div className={styles.suggestField}>
      <TextField {...props} inputRef={inputRef as RefObject<HTMLInputElement>} />
      <datalist id={listId}>
        {existing?.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>
      {similar ? (
        <p className={styles.suggestWarn}>
          Ya existe «{similar}», escrita un poco distinto.{" "}
          <button type="button" className={styles.suggestFix} onClick={() => setValue(similar)}>
            Usar «{similar}»
          </button>
        </p>
      ) : isNew ? (
        <p className={styles.suggestWarn}>Colección nueva: ninguna otra pieza la usa. Revisa que esté bien escrita.</p>
      ) : null}
      {others.length > 0 && !props.readOnly ? (
        <p className={styles.suggestList}>
          <span>Colecciones que ya existen:</span>
          {others.map((e) => (
            <button key={e} type="button" className={styles.suggestChip} onClick={() => setValue(e)}>
              {e}
            </button>
          ))}
        </p>
      ) : null}
    </div>
  );
}
