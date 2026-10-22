# Reglas de diseño y movimiento

Fuentes: artículos de **Emil Kowalski** (*Great Animations*, *7 Practical Animation Tips*, *You Don't Need Animations*, *The Magic of Clip Path*) y el repositorio **nextlevelbuilder/ui-ux-pro-max-skill** (guía rápida de UX, `motion.csv`, `ux-guidelines.csv`; para el tipo de producto "Architecture / Interior" y "Home Decoration & Interior Design" recomienda minimalismo, storytelling y portafolio con protagonismo visual).
Todo componente nuevo debe cumplir estas reglas.

## 1. Propósito y frecuencia
- Cada animación debe tener un **motivo** (explicar, dar continuidad o confirmar una acción) o ser un deleite **poco frecuente**.
- Se anima **1 o 2 elementos clave por vista**. El resto es estático.
- El **monograma animado** se ve **una vez por sesión** (sessionStorage). Una animación que se repite en cada visita deja de deleitar y molesta.
- **Nunca** se animan acciones de teclado ni elementos que se usan decenas de veces (filtros, navegación del menú con teclado).

## 2. Easing y duración (tokens en `globals.css`)
| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Todo lo que **entra o responde** al usuario (curva personalizada, más enérgica que el `ease-out` nativo) |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Movimiento de algo que **ya está en pantalla** (revelados con clip-path, paneles) |
| `--ease-elegant` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Fundidos lentos y cinematográficos (slideshows), el "vibe" de marca de lujo |
| `--dur-press` | 120ms | `:active` de botones |
| `--dur-ui` | 200ms | Hover, menús desplegables, tooltips (**siempre < 300ms**) |
| `--dur-reveal` | 600ms | Revelados al hacer scroll |
| `--dur-cinematic` | 1200ms | Fundidos del hero y de la portada (sitio de marketing: se permite algo más lento) |
- **Nunca `ease-in`** en UI: arranca lento y se siente torpe.
- **La salida es más rápida que la entrada** (~65% de la duración).

## 3. Rendimiento
- Solo se animan **`transform`, `opacity`, `clip-path` y `filter`**. Nunca width, height, top, left ni margin.
- Los revelados de imagen usan **`clip-path: inset()`**, que va por GPU y no provoca saltos de layout.
- Para los cambios de estado se usan **transiciones CSS** (son interrumpibles). Los keyframes quedan para efectos de una sola vez (precarga, Ken Burns).
- Imágenes con `next/image`, `sizes` correctos y proporción reservada (CLS = 0).

## 4. Detalles que se notan en conjunto
- Botones: `transform: scale(0.97)` en `:active`.
- **Nunca animar desde `scale(0)`**: los popovers entran desde `scale(0.96)` + opacidad.
- Los popovers **parten de su origen** (`transform-origin` en el botón que los abre).
- En los fundidos entre dos estados **de elementos pequeños** (botones, etiquetas) se añade **`filter: blur(2px)`** para unir el antes y el después. En fotos a pantalla completa no se usa, porque cuesta rendimiento.
- Elemento compartido entre vistas (`<ViewTransition>`): el **monograma** viaja de la portada a la cabecera de la marca. Solo un par de elementos por navegación.

## 5. Accesibilidad (crítico)
- **Las animaciones se ven siempre**, también con "Reducir movimiento" activado en el teléfono (decisión del cliente, 22-oct-2026: muchos iPhone lo traen activado y el sitio se veía estático). Por eso los movimientos se mantienen cortos y suaves, sin parpadeos ni destellos, y el slideshow conserva su botón de pausa.
- Contraste mínimo **4.5:1** en texto normal. Texto sobre foto siempre con degradado.
- Anillo de foco visible en todo control. Enlace "Saltar al contenido".
- Botones solo con icono: `aria-label`. Áreas táctiles de **44px** o más en móvil (24px como mínimo absoluto).
- **Contenido que rota solo** (slideshow): botón de **pausa/reproducir** visible, y se detiene al recibir foco o con la pestaña oculta.
- Orden de tabulación igual al orden visual. Jerarquía de encabezados sin saltos.
- Texto base de **16px** en móvil y sin scroll horizontal.

## 6. Revelado al hacer scroll
- Desplazamiento corto (**12–16px**) y **600ms** con `--ease-out`. Escalonado de **40–60ms** por elemento, máximo ~8 elementos.
- Sin JS, el contenido se ve igual (la clase `html.js` activa el estado oculto).
- No hay parallax en los textos, solo en fondos y de forma sutil.
