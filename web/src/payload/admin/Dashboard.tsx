import Link from "next/link";
import type { AdminViewServerProps, Where } from "payload";
import type { Foto, Producto } from "@/payload-types";
import { BRAND_COLORS, BRAND_NAMES, Monogram, type AdminBrand } from "./Brand";
import { formatDateTime } from "./dates";
import { thumb } from "./thumb";
import styles from "./admin.module.css";

const ADMIN = "/admin/collections";

/** Enlace a una lista ya filtrada (mismo formato de consulta que usa el panel). */
function listUrl(collection: string, where?: Record<string, string>) {
  if (!where) return `${ADMIN}/${collection}`;
  const params = Object.entries(where).map(([k, v]) => `where[${k}][equals]=${encodeURIComponent(v)}`);
  return `${ADMIN}/${collection}?${params.join("&")}`;
}

type Stat = { label: string; value: number; href: string; tone?: "warn" };
type Gap = { label: string; pieces: { id: number; name: string }[] };
type Recent = { key: string; title: string; kind: string; href: string; image: string | null; updatedAt: string };

const firstPhoto = (images: unknown): string | null => {
  const first = Array.isArray(images) ? images[0] : images;
  return first && typeof first === "object" && typeof (first as Foto).url === "string" ? (first as Foto).url! : null;
};

/** Lo que le puede faltar a una pieza para estar completa en el sitio. */
const GAPS: { label: string; missing: (p: Producto) => boolean }[] = [
  { label: "Medidas", missing: (p) => p.height == null && p.width == null && p.depth == null },
  { label: "Descripción", missing: (p) => !p.description?.trim() },
  { label: "Materiales", missing: (p) => !p.materials?.length },
  { label: "Precio (marcado para mostrarse, sin cifra)", missing: (p) => Boolean(p.showPrice) && p.priceAmount == null },
  { label: "Archivos de descarga", missing: (p) => !p.fileSkp && !p.fileDwg && !p.filePdf },
];
const SHOWN_NAMES = 3;

/** Lista de piezas con esos ids: un filtro que el panel entiende sin campos especiales. */
const piecesUrl = (ids: number[]) => `${ADMIN}/productos?${ids.map((id, i) => `where[id][in][${i}]=${id}`).join("&")}`;

const pieces = (n: number) => (n === 1 ? "1 pieza" : `${n} piezas`);

/** Inicio del panel: cifras por marca, accesos rápidos, lo que falta y los últimos cambios. */
export async function Dashboard({ initPageResult }: AdminViewServerProps) {
  const { payload, user } = initPageResult.req;
  const count = async (collection: "productos" | "proyectos" | "paquetes" | "servicios" | "suscriptores", where?: Where) =>
    (await payload.count({ collection, where, overrideAccess: true })).totalDocs;

  const [kVisible, kHidden, kSoldOut, kOnOrder, aProjects, aServices, rProjects, rPackages, subscribers, products] = await Promise.all([
    count("productos", { published: { equals: true } }),
    count("productos", { published: { equals: false } }),
    count("productos", { status: { equals: "agotado" } }),
    count("productos", { status: { equals: "bajo_pedido" } }),
    count("proyectos", { brand: { equals: "arpad" } }),
    count("servicios", { brand: { equals: "arpad" } }),
    count("proyectos", { brand: { equals: "aracena" } }),
    count("paquetes"),
    count("suscriptores", { status: { equals: "activo" } }),
    payload.find({ collection: "productos", limit: 500, depth: 0, sort: "_order", overrideAccess: true }),
  ]);

  const brands: { brand: AdminBrand; tagline: string; stats: Stat[]; links: { label: string; href: string }[] }[] = [
    {
      brand: "kormos",
      tagline: "Catálogo y Atelier",
      stats: [
        { label: "Piezas visibles", value: kVisible, href: listUrl("productos", { published: "true" }) },
        { label: "Ocultas", value: kHidden, href: listUrl("productos", { published: "false" }) },
        { label: "Bajo pedido", value: kOnOrder, href: listUrl("productos", { status: "bajo_pedido" }) },
        { label: "Agotadas", value: kSoldOut, href: listUrl("productos", { status: "agotado" }), tone: kSoldOut ? "warn" : undefined },
      ],
      links: [
        { label: "Piezas", href: listUrl("productos") },
        { label: "Categorías", href: listUrl("categorias") },
        { label: "Acabados", href: listUrl("acabados") },
      ],
    },
    {
      brand: "arpad",
      tagline: "Arquitectura, diseño y construcción",
      stats: [
        { label: "Proyectos", value: aProjects, href: listUrl("proyectos", { brand: "arpad" }) },
        { label: "Servicios", value: aServices, href: listUrl("servicios", { brand: "arpad" }) },
      ],
      links: [
        { label: "Proceso", href: "/admin/globals/proceso-arpad" },
        { label: "Equipo", href: listUrl("equipo") },
        { label: "Testimonios", href: listUrl("testimonios") },
      ],
    },
    {
      brand: "aracena",
      tagline: "Renders y visualización",
      stats: [
        { label: "Proyectos", value: rProjects, href: listUrl("proyectos", { brand: "aracena" }) },
        { label: "Paquetes", value: rPackages, href: listUrl("paquetes") },
      ],
      links: [{ label: "Preguntas frecuentes", href: "/admin/globals/preguntas-aracena" }],
    },
  ];

  // Agrupado por lo que falta: una lista de 26 piezas con "Falta: medidas" no dice qué hacer primero
  const gaps: Gap[] = GAPS.map((g) => ({ label: g.label, pieces: products.docs.filter(g.missing).map((p) => ({ id: p.id, name: p.name })) })).filter(
    (g) => g.pieces.length > 0,
  );
  const incomplete = products.docs.filter((p) => GAPS.some((g) => g.missing(p))).length;

  const recentSources = [
    { collection: "productos", kind: "Pieza", title: "name" },
    { collection: "proyectos", kind: "Proyecto", title: "title" },
    { collection: "paquetes", kind: "Paquete", title: "name" },
    { collection: "servicios", kind: "Servicio", title: "title" },
  ] as const;
  const recentLists = await Promise.all(
    recentSources.map(async (s) => {
      const { docs } = await payload.find({ collection: s.collection, limit: 8, sort: "-updatedAt", depth: 1, overrideAccess: true });
      return docs.map((d): Recent => {
        const record = d as unknown as Record<string, unknown>;
        return {
          key: `${s.collection}-${d.id}`,
          title: String(record[s.title] ?? ""),
          kind: s.kind,
          href: `${ADMIN}/${s.collection}/${d.id}`,
          image: firstPhoto(record.images ?? record.cover ?? record.image),
          updatedAt: d.updatedAt,
        };
      });
    }),
  );
  const recent = recentLists
    .flat()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8);

  // Solo el nombre de pila: "Hola, María", no "Hola, María Fernández Pérez"
  const name = (user && "name" in user && typeof user.name === "string" && user.name.trim().split(/\s+/)[0]) || "";

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashHead}>
        <div>
          <p className={styles.eyebrow}>Panel del sitio</p>
          <h1 className={styles.dashTitle}>{name ? `Hola, ${name}` : "Hola"}</h1>
          <p className={styles.dashLead}>¿Qué quieres hacer hoy? Todo lo que guardes aquí aparece en el sitio en la siguiente visita.</p>
        </div>
        <div className={styles.headLinks}>
          <Link className={styles.siteLink} href={listUrl("suscriptores", { status: "activo" })}>
            {subscribers === 1 ? "1 suscriptor" : `${subscribers} suscriptores`}
          </Link>
          <a className={styles.siteLink} href="/" target="_blank" rel="noopener noreferrer">
            Ver el sitio ↗
          </a>
        </div>
      </header>

      <nav className={styles.quick} aria-label="Accesos rápidos">
        <Link href={`${ADMIN}/productos/create`} className={styles.quickItem}>
          <span className={styles.quickPlus} aria-hidden="true">+</span>
          <span>
            <strong>Agregar pieza</strong>
            <small>Kormós · catálogo</small>
          </span>
        </Link>
        <Link href={`${ADMIN}/proyectos/create`} className={styles.quickItem}>
          <span className={styles.quickPlus} aria-hidden="true">+</span>
          <span>
            <strong>Agregar proyecto</strong>
            <small>Arpad o Aracena</small>
          </span>
        </Link>
        <Link href={`${ADMIN}/paquetes/create`} className={styles.quickItem}>
          <span className={styles.quickPlus} aria-hidden="true">+</span>
          <span>
            <strong>Agregar paquete</strong>
            <small>Aracena · renders</small>
          </span>
        </Link>
        <Link href={`${ADMIN}/fotos/create`} className={styles.quickItem}>
          <span className={styles.quickPlus} aria-hidden="true">+</span>
          <span>
            <strong>Subir fotos</strong>
            <small>Biblioteca</small>
          </span>
        </Link>
      </nav>

      <section className={styles.brands} aria-label="Marcas">
        {brands.map((b) => (
          <article key={b.brand} className={styles.brandCard} style={{ ["--brand-color" as string]: BRAND_COLORS[b.brand] }}>
            <header className={styles.brandHead}>
              <Monogram brand={b.brand} size={36} color="currentColor" />
              <div>
                <h2 className={styles.brandName}>{BRAND_NAMES[b.brand]}</h2>
                <p className={styles.brandTagline}>{b.tagline}</p>
              </div>
            </header>
            <ul className={styles.stats}>
              {b.stats.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className={styles.stat} data-tone={s.tone}>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={styles.brandLinks}>
              {b.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <div className={styles.columns}>
        <section className={styles.panel} aria-labelledby="falta">
          <header className={styles.panelHead}>
            <h2 id="falta" className={styles.panelTitle}>
              Qué falta en las piezas
            </h2>
            <span className={styles.badge} title="Piezas a las que les falta algo">
              {incomplete}
            </span>
          </header>
          {gaps.length === 0 ? (
            <p className={styles.empty}>Todas las piezas tienen sus datos completos.</p>
          ) : (
            <ul className={styles.gaps}>
              {gaps.map((g) => {
                const rest = g.pieces.length - SHOWN_NAMES;
                return (
                  <li key={g.label} className={styles.gap}>
                    <p className={styles.gapHead}>
                      <strong>{g.label}</strong>
                      <span>Falta en {pieces(g.pieces.length)}</span>
                    </p>
                    <p className={styles.gapNames}>
                      {g.pieces.slice(0, SHOWN_NAMES).map((p, i) => (
                        <span key={p.id}>
                          {i > 0 ? ", " : null}
                          <Link href={`${ADMIN}/productos/${p.id}`}>{p.name}</Link>
                        </span>
                      ))}
                      {rest > 0 ? ` y ${pieces(rest)} más` : null}
                    </p>
                    {rest > 0 ? (
                      <Link href={piecesUrl(g.pieces.map((p) => p.id))} className={styles.gapAll}>
                        Ver las {g.pieces.length} piezas →
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="recientes">
          <header className={styles.panelHead}>
            <h2 id="recientes" className={styles.panelTitle}>
              Últimos cambios
            </h2>
          </header>
          <ul className={styles.rows}>
            {recent.map((r) => (
              <li key={r.key}>
                <Link href={r.href} className={styles.row}>
                  <Thumb src={r.image} />
                  <span className={styles.rowBody}>
                    <strong>{r.title}</strong>
                    <small>
                      {r.kind} · {formatDateTime(r.updatedAt)}
                    </small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Thumb({ src }: { src: string | null }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- miniatura del panel, ya optimizada por /_next/image
    <img className={styles.thumb} src={thumb(src, 96)} alt="" width={48} height={48} loading="lazy" />
  ) : (
    <span className={styles.thumb} aria-hidden="true" />
  );
}
