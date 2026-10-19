import styles from "./admin.module.css";

/** Descarga de la lista de suscriptores (CSV que abre Excel). */
export function ExportButton() {
  return (
    <p className={styles.exportRow}>
      <a className={styles.siteLink} href="/api/suscriptores/exportar" download>
        Descargar la lista (Excel)
      </a>
    </p>
  );
}
