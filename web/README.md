# Sitio web — Aracena Studio · Arpad Studio · Kormós

Next.js 16 (App Router, Cache Components) + TypeScript + CSS Modules + Payload CMS 3 (panel en `/admin`, SQLite en local). Desarrollo **solo local**. Requiere **Node 24**.
Plan general: [`../ANALISIS-Y-PLAN.md`](../ANALISIS-Y-PLAN.md) · ADN de marca: [`../ADN-DE-MARCA.md`](../ADN-DE-MARCA.md) · Reglas de movimiento: [`DISENO-Y-MOVIMIENTO.md`](DISENO-Y-MOVIMIENTO.md)

## Arrancar

```bash
npm run dev
```

Abre http://localhost:3000. Rutas: `/` (portada), `/arpad`, `/kormos`, `/aracena` y el panel en `/admin`.

La primera vez (o en otra computadora): copia `.env.example` como `.env`, rellena `PAYLOAD_SECRET` y carga el contenido inicial:

```bash
npm run seed
```

Crea la base `data/sitio.db`, sube las fotos a `uploads/` y crea un usuario de prueba para el panel. Su correo y contraseña quedan en `.env` (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`). Para empezar de cero: `npm run seed -- --reset`.
Para volver a ver la animación de entrada, borra el `sessionStorage` del sitio (la intro se muestra una vez por sesión).

## Estructura

| Ruta | Qué hay |
|---|---|
| `src/app/(site)/` | El sitio público (su propio layout raíz). `page.tsx` es la portada: las tres marcas al mismo nivel, en orden alfabético |
| `src/app/(site)/{arpad,kormos,aracena}/` | `layout.tsx` (tema + cabecera + pie), inicio y páginas de cada marca (detalle en `proyectos/[slug]` y `catalogo/[slug]`) |
| `src/app/(payload)/` | Panel de administración (`/admin`) y su API (`/api/...`). Plantilla oficial de Payload |
| `src/app/global-not-found.tsx` | 404 de las URL que no existen (hay dos layouts raíz) |
| `src/app/compartir/[id]` | Imagen 1200×630 para compartir de cada foto del panel (se genera al pedirla) |
| `src/payload.config.ts` · `src/payload/` | Configuración del panel: colecciones, campos, permisos y avisos de caché |
| `src/data/` | Lectura del contenido del panel para el sitio (en caché hasta que se edita) |
| `src/components/projects/` | Rejilla con filtros, ficha, antes/después, galería con visor |
| `src/components/kormos/` | Catálogo de Kormós, ficha de producto, "Mi selección" (carrito) y Atelier |
| `scripts/seed.mts` · `scripts/contenido-inicial/` | Carga inicial del panel con el contenido de muestra |
| `data/` · `uploads/` | Base de datos local y archivos subidos desde el panel (no se publican con el código) |
| `src/lib/cart.ts` | Estado del carrito (localStorage) y del cajón |
| `src/app/(site)/globals.css` | Tokens de diseño y los tres temas `[data-brand]` |
| `src/lib/brands.ts` | Datos de cada marca: textos, menú, fotos del hero, WhatsApp |
| `src/lib/whatsapp.ts` | Enlaces `wa.me` con el mensaje ya escrito (único número: 849-472-2473) |
| `src/components/` | Cabecera, pie, precarga, slideshow, logos, revelado y secciones |
| `public/brand/` | Logos vectorizados (SVG) · `public/media/` fotos de muestra optimizadas |

## Logos y fotos (scripts)

Los logos originales son PNG; se vectorizan con potrace:

```bash
node scripts/prepare-logos.mjs
```

(Para el logotipo completo de Kormós, define `KORMOS_ZIP_DIR` con la carpeta donde se extrajo `LOGO KORMÓS_8.zip`.)

Las fotos de muestra salen de `../referencias-instagram` y se optimizan con:

```bash
node scripts/prepare-media.mjs
```

> Son fotos **provisionales** de Instagram y del catálogo Canva: se cambian por los originales en alta antes de publicar.

## Producción local y publicación

```bash
npm run build
npm run start -- -p 3001
```

Antes de publicar, define el dominio para canonical, Open Graph, sitemap y JSON-LD:

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

Imágenes para compartir (1200×630) e iconos por marca, después de cambiar fotos o logos:

```bash
node scripts/prepare-og.mjs
node scripts/prepare-icons.mjs
```

## Panel de administración (`/admin`)

Todo se edita sin tocar código:

| Sección | Qué se edita |
|---|---|
| Kormós → Productos | Nombre, código, categoría, resumen, descripción, fotos, acabados (con fotos propias o no), medidas, materiales, precio (RD$ o US$, visible u oculto), estado y archivos .skp/.dwg/.pdf |
| Kormós → Categorías · Acabados | Filtros del catálogo; maderas, telas y colores reutilizables con su muestra |
| Arpad y Aracena → Proyectos · Paquetes · Preguntas | Portafolio (con antes/después y créditos), paquetes de render y preguntas frecuentes |
| Biblioteca → Fotos · Archivos 3D y fichas | Todas las fotos (al subir una se detecta si es un recorte) y los archivos de descarga |

- **Orden:** arrastra las filas en la lista. **Ocultar sin borrar:** desmarca "Visible en el sitio".
- Al guardar, el sitio muestra el cambio en la siguiente visita (la caché se invalida sola).
- "Vista previa" abre la ficha pública de un producto o proyecto.
- Las piezas y proyectos nuevos se generan en su primera visita; `npm run build` los deja prerenderizados.
- Los textos están preparados para inglés: basta añadir el idioma en `src/payload.config.ts` (`localization`).

Comandos de Payload (Node 24 necesita el lanzador `scripts/payload-cli.mjs`):

```bash
npm run generate:types
```

```bash
npm run generate:importmap
```

Tras cambiar campos en `src/payload/`, ejecuta `generate:types`. Si el cambio **borra** un campo con datos, Payload pide confirmación en la terminal de `npm run dev` antes de tocar la base, y las páginas se quedan esperando hasta que respondes. Arranca `npm run dev` en una terminal propia para poder contestar.

## Si el servidor de desarrollo no ve un archivo regenerado

La carpeta está en OneDrive y a veces el vigilante de archivos no avisa de los cambios (pasó con `media.generated.ts`). Detén `npm run dev` y vuelve a arrancarlo.

OneDrive también sincroniza `data/sitio.db`. Eso sirve de copia de seguridad, pero si algún día aparece "database is locked", pausa la sincronización mientras trabajas.

## Decisiones técnicas a recordar

- **Keyframes dentro de cada CSS Module**: CSS Modules les da ámbito local, así que no ven los de `globals.css`.
- **Logos**: los estáticos se pintan por máscara CSS (`<Logo>`, ligero, hereda el color). Solo la precarga usa SVG en línea (`<LogoAnimated>`, servidor) para animar el trazo.
- **Enlaces entre marcas con `scroll={false}`** + `<ScrollToTop>`: con Cache Components, el scroll automático de Next caía una pantalla más abajo.
- **Fichas de proyecto y producto con `instant = false`** y sin `<Suspense>`: todas se prerenderizan, así el HTML sale completo y en línea (mejor SEO) en vez de un armazón con el contenido oculto.
- **Cabecera sólida sin JS** en páginas sin foto arriba: el elemento raíz de la página lleva `data-solid-header` (ver `SiteHeader.module.css`).
- **Precio con formato fijo** (no `toLocaleString`) para que servidor y navegador coincidan al hidratar.
- **`<Reveal>`** controla `is-visible` con estado de React (evita desajustes de hidratación) y comparte un único IntersectionObserver.
