"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./admin.module.css";

export type QuickFilter = { label: string; where?: Record<string, string> };

/**
 * Filtros de un clic sobre la tabla (todas, visibles, ocultas, por estado…) y,
 * si hay, una nota que solo sirve en la lista (cómo reordenar arrastrando).
 */
export function QuickFilters({ filters = [], hint }: { filters?: QuickFilter[]; hint?: string }) {
  const pathname = usePathname();
  const params = useSearchParams();

  // Solo cuenta el filtro simple "where[campo][equals]=valor" que crean estos botones
  const current: Record<string, string> = {};
  let otherFilter = false;
  params.forEach((value, key) => {
    const m = /^where\[([^\]]+)\]\[equals\]$/.exec(key);
    if (m) current[m[1]] = value;
    else if (key.startsWith("where")) otherFilter = true;
  });
  const sameAs = (where: Record<string, string> = {}) =>
    !otherFilter && Object.keys(where).length === Object.keys(current).length && Object.entries(where).every(([k, v]) => current[k] === v);

  // Las filas solo se arrastran con la lista en el orden del sitio
  const sort = params.get("sort");
  const sortedByColumn = Boolean(sort) && sort !== "_order" && sort !== "-_order";
  const inSiteOrder = new URLSearchParams(params.toString());
  inSiteOrder.set("sort", "_order");

  return (
    <>
      {filters.length ? (
        <nav className={styles.filters} aria-label="Filtros rápidos">
          {filters.map((f) => {
            const query = Object.entries(f.where ?? {})
              .map(([k, v]) => `where[${k}][equals]=${encodeURIComponent(v)}`)
              .join("&");
            const active = sameAs(f.where);
            return (
              <Link key={f.label} href={query ? `${pathname}?${query}` : pathname} className={styles.filter} aria-current={active ? "true" : undefined}>
                {f.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
      {hint ? (
        <p className={styles.listHint}>
          {sortedByColumn ? (
            <>
              La lista está ordenada por una columna, así que no se puede arrastrar.{" "}
              <Link href={`${pathname}?${inSiteOrder.toString()}`}>Volver al orden del sitio</Link>
            </>
          ) : (
            hint
          )}
        </p>
      ) : null}
    </>
  );
}
