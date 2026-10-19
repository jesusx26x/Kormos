import styles from "./admin.module.css";

// Colores de cada marca (los mismos del sitio, ver globals.css)
export const BRAND_COLORS = { aracena: "#3a4a3d", arpad: "#062045", kormos: "#463d34" } as const;
export const BRAND_NAMES = { aracena: "Aracena Studio", arpad: "Arpad Studio", kormos: "Kormós" } as const;
export type AdminBrand = keyof typeof BRAND_COLORS;

/** Monograma pintado por máscara: así toma el color que se le dé. */
export function Monogram({ brand, size = 40, color }: { brand: AdminBrand; size?: number; color?: string }) {
  return (
    <span
      aria-hidden="true"
      className={styles.monogram}
      style={{
        width: size,
        height: size,
        backgroundColor: color ?? BRAND_COLORS[brand],
        maskImage: `url(/brand/${brand}Monogram.svg)`,
        WebkitMaskImage: `url(/brand/${brand}Monogram.svg)`,
      }}
    />
  );
}

/** Pantalla de entrada: las tres marcas al mismo nivel, en orden alfabético como en la portada. */
export function Logo() {
  return (
    <div className={styles.loginLogo}>
      <div className={styles.loginMarks}>
        {(["aracena", "arpad", "kormos"] as const).map((b) => (
          <Monogram key={b} brand={b} size={56} />
        ))}
      </div>
      <p className={styles.loginTitle}>Panel del sitio</p>
      <p className={styles.loginSub}>Aracena Studio · Arpad Studio · Kormós</p>
    </div>
  );
}

/** Ícono del menú y de la barra superior. */
export function Icon() {
  return (
    <span className={styles.navIcon} aria-label="Panel del sitio">
      {(["aracena", "arpad", "kormos"] as const).map((b) => (
        <span key={b} style={{ backgroundColor: BRAND_COLORS[b] }} />
      ))}
    </span>
  );
}

/** Ayuda bajo el logo en la entrada. */
export function LoginHelp() {
  return <p className={styles.loginHelp}>Entra con el correo y la contraseña que te dieron para administrar el sitio.</p>;
}
