"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./admin.module.css";

export type QuickFilter = { label: string; where?: Record<string, string> };

/** Filtros de un clic sobre la tabla (todas, visibles, ocultas, por estado…). */
export function QuickFilters({ filters }: { filters: QuickFilter[] }) {
  const pathname = usePathname();
  const params = useSearchParams();

  // Solo cuenta el filtro simple "where[campo][equals]=valor" que crean estos botones
  const current: Record<string, string> = {};
  params.forEach((value, key) => {
    const m = /^where\[([^\]]+)\]\[equals\]$/.exec(key);
    if (m) current[m[1]] = value;
  });
  const sameAs = (where: Record<string, string> = {}) =>
    Object.keys(where).length === Object.keys(current).length && Object.entries(where).every(([k, v]) => current[k] === v);

  return (
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
  );
}
