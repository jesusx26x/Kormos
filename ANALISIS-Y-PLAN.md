# Kormós · Arpad Studio · Aracena Studio
## Análisis y plan de implementación del sitio web

Fecha: 16 de octubre de 2026
Entorno: desarrollo local (sin GitHub, sin hosting ni dominio por ahora)
Fuentes: transcripción de la reunión 1, transcripción de la reunión 2 (hoy), carpetas de logos en `KORMOS/`, sitios de referencia (Minotti, Poliform, Somma, Entre Dos Interiores).

---

## 1. Resumen

Es **un solo sitio con tres marcas**:

| Marca | Qué es | Complejidad en la web |
|---|---|---|
| **Arpad Studio**, Arquitectura, Diseño y Construcción | Estudio de arquitectura. **Marca principal del grupo.** | **Media.** La sección más completa de las tres "de estudio": portafolio, servicios, proceso de trabajo, equipo, testimonios y proyectos destacados. |
| **Kormós**, Furniture Design | Ebanistería y mobiliario de diseño, sofisticado y elegante | **Alta** (la más compleja técnicamente). Catálogo con precios, variantes de color, estados de disponibilidad, carrito, cotización por WhatsApp, descarga libre de modelos 2D/3D (SketchUp y DWG/AutoCAD), Atelier y panel de administración. |
| **Aracena Studio**, Rendering Projects | Estudio de renders y visualización | **Baja-media.** Portafolio, servicios, **catálogo de paquetes de render** con precio y botón de contactar. |

> **Corrección importante:** la reunión 1 decía "el principal que es Kormós", pero **la marca principal del grupo es ARPAD STUDIO** (confirmado el 16-oct-2026). Kormós sigue siendo la parte técnicamente más compleja del sitio, pero **en la portada no hay jerarquía visible** entre las tres marcas.

Hay una **portada central** bella y elegante que reúne todo, con **los tres logos juntos y al mismo nivel**. Desde ella el visitante escoge la marca. Cada marca tiene su propia vista, pero **las tres comparten la misma estructura**: solo cambian los colores, el logo, el contenido y, en Kormós, las funciones de tienda.

La referencia principal de diseño es **Minotti**: "literalmente ese diseño", adaptado al ADN de Kormós. **Entre Dos Interiores** aporta piezas que ya construimos y podemos reutilizar: la portada con fotos protagonistas, los mosaicos de imágenes, la animación del monograma y el footer "Desarrollado por Trinitaria Digital".

**Regla de oro de todo el sitio:** cada llamada a la acción de las tres marcas termina en **un único WhatsApp: 849-472-2473**, con un mensaje ya escrito que dice de qué marca viene y qué se pidió. No hay pasarela de pago ni cuentas de usuario.

---

## 2. Lo que recibimos (inventario y observaciones)

### 2.1 Logos

| Carpeta | Archivos | Observaciones |
|---|---|---|
| `LOGO KORMOS/` | `LOGO KORMÓS_1.png` (isotipo "iK"), `LOGO KORMÓS_2.png` (K con "KORMOS" en vertical), `LOGO KORMÓS_8.zip` (19 archivos) | Los PNG son **blancos sobre fondo transparente**, a 1512×2139. El zip trae versiones sobre fondo café, gris y verde oliva, un mockup de bolsa, la **tarjeta de presentación** (frente y dorso) y una imagen de 5120×3584 (`11650363.png`). |
| `Logo ARPAD/` | `lOGO arpad 2.png` (logotipo horizontal azul marino), `LOGO-ARPAD-STUDIO (1).png` (monograma negro), `LOGOS AP.pdf` | El PDF es una imagen rasterizada de **muy baja resolución**. Trae 4 variantes: sobre beige, sobre azul marino, horizontal y vertical. |
| `LOGO ARACENA STUDIO/` | `01 (1).png` (horizontal), `02.png` (vertical) a 4542×2800, `LOGOS AP.pdf` | ⚠️ El `LOGOS AP.pdf` de esta carpeta es **el mismo archivo de Arpad** (mismo tamaño y contenido). Los PNG de Aracena son **mockups con textura de papel en relieve**, no logos limpios. |

**Hay que pedir:** los logos de las tres marcas en **vector (SVG, AI o PDF vectorial)**, con fondo transparente y en positivo y negativo. El vector es imprescindible para animar el monograma (el trazo que se dibuja), como en Entre Dos Interiores.

### 2.2 Datos de contacto (sacados de la tarjeta de Kormós)

- Teléfono / WhatsApp: **849-472-2473** → `https://wa.me/18494722473`
- Correo: **kormosfurniture@gmail.com**
- Instagram: **@kormos.rd**
- Nombre oficial: **KORMÓS**, con tilde, y el descriptor **"Furniture Design"**.

### 2.3 Paleta de colores sacada de los archivos (aproximada, confirmar con el manual de marca)

**Kormós**: tierra, cálida y sobria (en línea con Minotti)
| Uso | Hex | De dónde sale |
|---|---|---|
| Café profundo (fondo principal oscuro) | `#463D34` | Fondo de `LOGO KORMÓS.jpg 9` |
| Café casi negro | `#33302A` | `LOGO KORMÓS_6` |
| Gris cálido oscuro | `#54524D` / `#5D5C5A` | `_8`, `_3` |
| Oliva grisáceo | `#575850` | Mockup de la bolsa |
| Topo / piedra | `#79756A` | `LOGO KORMÓS.jpg 999` |
| Gris claro cálido | `#989896` | `_7`, `_9`, tarjeta |
| Blanco hueso (texto y logo) | `#F5F3EF` (propuesto) | Logo blanco |

**Arpad Studio**: azul marino institucional `#062045` (logo) y `#28354F` (fondo del PDF), con beige arena `#C2B8A0`.
**Aracena Studio**: verde bosque `#3A4A3D` y gris papel `#EFEFEF`. Su tipografía es una serif de remates finos, con "RENDERING PROJECTS" en una sans.

### 2.3b ADN de marca (Instagram, Linktree, catálogo Canva)
El análisis completo está en **[ADN-DE-MARCA.md](ADN-DE-MARCA.md)** y las fotos y textos descargados en [`referencias-instagram/`](referencias-instagram/). Lo que cambia en este plan:
- **Ecosistema:** Aracena visualiza (2018) → Arpad diseña y ejecuta (2020, matriz: "Ceo" de Kormós) → Kormós fabrica (2025). Frase de grupo para la portada: *"Diseño que se visualiza, se ejecuta y se materializa."*
- **Paletas actualizadas** con los colores reales de redes: sección 4 de ADN-DE-MARCA.md. Sustituyen a las de la sección 2.3.
- **Kormós ya tiene un catálogo**, la "Colección Origen" (ottomanes, mesas auxiliares, mesas de noche, mesas de centro, espejos y cuadros), con materiales oficiales. Sirve como contenido de muestra para la Fase 4.
- **Aracena publica sus políticas** (no hay presupuestos genéricos, trabajan con anticipo y agenda). Los paquetes deben mostrar precio "desde".
- ✅ **WhatsApp único confirmado: 849-472-2473** (`wa.me/18494722473`) para las tres marcas. El 849-467-2423 que aparece en el Linktree de Aracena **no se usa** en la web.
- ⚠️ **Logotipo de Kormós:** conviven una sans (tarjeta) y una serif (catálogo Canva). Hay que definir cuál es el oficial.

### 2.4 Nombres oficiales (confirmados)

La transcripción automática deformó los nombres ("Cormos/Colmo", "Arpa/APA", "Aracana Designe/Para cena/Acena"). En todo el sitio se usará **KORMÓS** (con tilde), **ARPAD STUDIO** y **ARACENA STUDIO**. ✅ Confirmado.

---

## 3. Requisitos consolidados (ambas reuniones)

Prioridad: **P1** = indispensable para la primera versión · **P2** = importante, puede llegar después · **P3** = deseable.

### 3.1 Estructura general
| # | Requisito | Prioridad |
|---|---|---|
| G1 | Un solo dominio con las 3 empresas | P1 |
| G2 | Portada inicial bella que centralice todo, con **los tres logos juntos y sin jerarquía visible**. Al elegir uno se entra a esa marca | P1 |
| G3 | Cada marca redirige a su vista con sus servicios, condiciones, portafolio y contacto | P1 |
| G4 | La misma interfaz para las 3 marcas. Cambian los productos, las imágenes y la identidad | P1 |
| G5 | Un apartado **"Servicios"** en el menú de cada marca que muestre los servicios de las otras dos (renders, ebanistería, planos), discreto para que la página no se vea cargada | P1 |
| G6 | Footer con redes y derechos reservados. ~~"Desarrollado por Trinitaria Digital"~~ retirado el 19-oct-2026: Trinitaria no participa en el desarrollo ni en la publicación | P1 |
| G7 | Fotos con animación (no hay videos). Encabezados tipo "Colección 2026" | P1 |
| G8 | Suscripción por correo en el footer, para recibir novedades cuando se publique algo nuevo | P2 |

### 3.2 Kormós: catálogo y tienda sin pago
| # | Requisito | Prioridad |
|---|---|---|
| K1 | Catálogo por categorías (sofás, mesas, sillas, mesitas de noche…) | P1 |
| K2 | Ficha de producto: nombre, render principal, **imágenes en ambiente**, descripción breve, **dimensiones (alto × ancho × profundidad)**, materiales y precio (o "Precio a consultar", **según la pieza**) en **RD$ o US$, según la pieza** | P1 |
| K3 | **Selector de color**: al escoger un color cambian las imágenes del producto | P1 |
| K4 | **Estado de la pieza**: Disponible · Bajo pedido / en producción (pago contra entrega) · Próximamente · Agotado. **Nunca se muestran cantidades ni unidades restantes.** Botón **"Consultar disponibilidad"**, que abre WhatsApp | P1 |
| K5 | **Carrito tipo Amazon**: agregar varias piezas con color y cantidad | P1 |
| K6 | Botón "Solicitar cotización" en el carrito que abre el **WhatsApp (849-472-2473) con el mensaje y la lista del carrito ya escritos** | P1 |
| K7 | **Descarga libre** de modelos en SketchUp (.skp) y AutoCAD (.dwg), más ficha técnica en PDF. Sin barrera ni formulario | P1 |
| K8 | Después de descargar, invitación a cotizar: *"¿Quieres saber cuánto cuesta? Cotiza por WhatsApp"*. **Kormós decide en cada pieza qué tan detallado es el archivo que sube** | P1 |
| K9 | **Atelier**: una sola sección (subtítulo "Mobiliario a la medida") para diseñar una pieza personalizada → contacto por WhatsApp | P1 |
| K10 | **Proyectos / portafolio** de Kormós (piezas instaladas) | P1 |
| K11 | Sin registro ni inicio de sesión para el cliente. Cero fricción | P1 |

### 3.3 Arpad Studio (marca principal) y Aracena Studio
| # | Requisito | Prioridad |
|---|---|---|
| A1 | Portafolio de trabajos (renders, diseños, PDF) para las dos marcas | P1 |
| A2 | Servicios que ofrecen, con precio si lo tienen | P1 |
| A3 | Llamada a la acción **"Contacta"** que va a WhatsApp | P1 |
| A4 | **Arpad, sección más completa**: proyectos destacados, proceso de trabajo (pasos), equipo, testimonios y cifras o trayectoria | P1 |
| A5 | **Aracena, catálogo de paquetes de render** (ej. render interior, exterior, planta 3D, recorrido): descripción, qué incluye, plazo y precio (RD$ o US$). Botón "Solicitar paquete" que abre WhatsApp | P1 |

### 3.4 Administración
| # | Requisito | Prioridad |
|---|---|---|
| D1 | Panel privado donde Kormós sube artículos nuevos (fotos por color, datos, precio, archivos 2D/3D) | P1 |
| D2 | Marcar el estado de cada artículo (disponible, agotado, próximamente, bajo pedido) | P1 |
| D3 | Gestionar proyectos y servicios de las 3 marcas | P1 |
| D4 | Al publicar algo nuevo, avisar por correo a los suscriptores | P2 |
| D5 | Ver y exportar suscriptores y solicitudes (leads) | P2 |

### 3.5 Fuera del alcance actual (anotado para después)
- Compra del dominio (en la reunión se habló de unos RD$1,000–1,200 al año; depende de la extensión: `.com`, `.do` o `.com.do`).
- Hosting, servidor, correo con dominio propio y despliegue.
- Repositorio remoto o GitHub (por decisión del cliente).

---

## 4. Decisiones tomadas (16-oct-2026)

| # | Tema | Decisión | Qué cambia en el sitio |
|---|---|---|---|
| 1 | **Descargas .skp / .dwg** | **Descarga libre**, sin barrera ni formulario | El botón "Descargar" baja el archivo directamente. Justo después aparece la invitación *"¿Quieres saber cuánto cuesta? Cotiza por WhatsApp"*. No hace falta servidor de leads en la v1 |
| 2 | **Marca principal y portada** | **ARPAD STUDIO es la marca principal.** En la portada van **los tres logos juntos, sin jerarquía visible** | La portada muestra las tres marcas al mismo nivel (tres paneles o columnas iguales). No hay monograma central único |
| 3 | **WhatsApp** | **Uno solo: 849-472-2473** para las tres marcas | Cada mensaje empieza indicando la marca (*"Hola, escribo desde la web de Arpad Studio…"*) para que se pueda clasificar en el chat |
| 4 | **Atelier / a la medida** | **Una sola sección "Atelier"**, con el subtítulo "Mobiliario a la medida" | Una entrada en el menú de Kormós |
| 5 | **Aracena** | **Catálogo de paquetes de render** | Nueva vista `/aracena/paquetes` con tarjetas de paquete (qué incluye, plazo, precio) y el botón "Solicitar paquete" que abre WhatsApp |
| 6 | **Precios** | **Se decide en cada producto**: precio visible o "Precio a consultar" | Un interruptor por producto en el panel |
| 7 | **Moneda** | **RD$ o US$, según el producto** | Un campo de moneda en cada producto y en cada paquete |
| 8 | **Idioma** | **Español en la v1, con la estructura lista para inglés** | Rutas y textos preparados para traducir (i18n), sin traducir todavía |
| 9 | **Inventario** | **Nunca se muestran cantidades ni unidades restantes.** Para la disponibilidad, se pregunta por WhatsApp | La ficha muestra el estado (Disponible · Bajo pedido · Próximamente · Agotado) y el botón **"Consultar disponibilidad"** con mensaje ya escrito |
| 10 | **Detalle de los archivos 3D** | **Kormós lo decide en cada pieza** | El panel solo sube el archivo que Kormós entregue. El sitio no lo simplifica ni lo protege |
| 11 | **Nombres oficiales** | **KORMÓS**, **ARPAD STUDIO**, **ARACENA STUDIO** ✅ | Se usan tal cual |
| 12 | **Peso de Arpad** | **Sección más completa** que la de Aracena | Se añaden proceso, equipo, testimonios, cifras o trayectoria y proyectos destacados |

> **Riesgo aceptado:** con la descarga libre, cualquiera puede bajar los modelos. Lo mitigan dos cosas: Kormós decide qué tan detallado es cada archivo, y la invitación a cotizar aparece justo después de la descarga. Si más adelante se quiere un registro de quién descarga, el mini-formulario (nombre + WhatsApp) se puede añadir en la Fase 6 sin rehacer nada.

> Dato de las referencias: Minotti exige registrarse como arquitecto o distribuidor para descargar, y Somma pide una cuenta gratis. La descarga libre de Kormós es una ventaja frente a ellos para arquitectos e interioristas, que pueden meter la pieza en sus proyectos sin fricción.

---

## 5. Análisis de referencias: qué tomamos de cada una

### 5.1 Minotti (referencia principal)
- **Fotografía como protagonista absoluta**: hero a pantalla completa, a menudo **dividido en dos imágenes** que cambian al hacer scroll.
- **Tipografía sans fina y muy espaciada** (Raleway). Mucho aire y poca interfaz.
- Menú superior mínimo (Login · Designers · Download Area · Catalogues · Contact · My Selection) y **menú hamburguesa** con las categorías Indoor/Outdoor.
- Secciones: **Colección 2026** · Focus On (Indoor/Outdoor) · Be Inspired (proyectos por tipo: residencial, hotel, restaurante…) · Noticias · Redes · footer con suscripción.
- Categorías de producto: sofás, sillones, mesas, sillas, mesas de centro, consolas, libreros, alfombras, camas, mesitas de noche.
- **"My Selection"** = lista de piezas → **en Kormós es el carrito**.
- **Download Area**: Minotti la protege con registro. **Kormós la deja libre**, lo que es una ventaja para arquitectos e interioristas.

### 5.2 Poliform
- Navegación de producto muy organizada por ambientes (Cocina · Sistemas · Sofás · Complementos de día y de noche · Exterior).
- Bloques editoriales grandes ("Collection 2026", noticias) con texto corto y un CTA "Discover".
- Icono de **favoritos** (corazón) siempre visible en la cabecera → nuestro **icono de carrito con contador**.

### 5.3 Somma (somma.do)
- Referencia **local** y de **marca paraguas**: "LA CASA SOMMA · Una marca, cinco formas de agregar valor". Son **tarjetas por cada línea de negocio**, cada una con su CTA. Es el patrón de nuestra portada con tres marcas al mismo nivel.
- Hero con titular grande, subtítulo y un CTA de color ("Conversemos").
- Cada línea tiene su propio CTA y su propio tono, pero todas comparten el mismo estándar visual.

### 5.4 Entre Dos Interiores (nuestro, reutilizable)
Construido con **Next.js**. De ahí tomamos:
- **Portada aparte** (`/`) que entra al sitio completo (`/explorar`): hero a pantalla completa con **slideshow de obras** ("OBRA 01 / 04", nombre del proyecto y subtítulo), **efecto Ken Burns** (zoom lento), barra de progreso y numeración 01–04.
- **Animación del monograma**: precarga con keyframes de *trazo → relleno → velo que se retira* (`ed-trazo`, `ed-relleno`, `ed-velo-fuera`). En nuestra portada **los tres monogramas se dibujan a la vez** (la A de Arpad, la "iK" de Kormós y la AS de Aracena), con el mismo tamaño y ritmo. Dentro de cada marca, solo se dibuja el suyo.
- **Mosaicos de imágenes** en el portafolio: una imagen alta a la izquierda y una cuadrícula a la derecha, con filtros por tipo ("Todos · Residencial · Comercial").
- Transiciones entre vistas (`vista-sale` / `vista-entra`), entradas con fundido y "cámara lenta".
- Secciones: Portafolio · Nosotras · Servicios (pestañas 01/05) · **Proceso (pasos 01–04)** · Instagram · Footer. Proceso y Servicios en pestañas encajan con la sección más completa de Arpad.
- **Footer**: frase de marca, navegación, servicios, contacto y redes, "© 2026 … Todos los derechos reservados." y **"Desarrollado por Trinitaria Digital"**, que enlaza a `trinitariadigital.do`.
- Botón flotante de contacto.
- Sistema de diseño con variables CSS (colores, tipografía con `clamp()`, transiciones). Lo replicamos con **un juego de variables por marca**.

---

## 6. Arquitectura de información (mapa del sitio)

```
/                                   Portada: los 3 logos juntos, sin jerarquía → elegir marca
│
├── /arpad                           Inicio Arpad Studio (marca principal, sección más completa)
│   ├── /arpad/proyectos(/[slug])    Portafolio arquitectura / diseño / construcción
│   ├── /arpad/servicios             Arquitectura · Diseño · Construcción
│   ├── /arpad/proceso               Cómo trabajamos (pasos 01–0X)
│   ├── /arpad/estudio               Equipo, trayectoria, valores, testimonios
│   └── /arpad/contacto
│
├── /kormos                          Inicio Kormós
│   ├── /kormos/coleccion-2026       Colección destacada (editorial)
│   ├── /kormos/catalogo             Catálogo completo + filtros (categoría, estado, material)
│   │   └── /kormos/catalogo/[categoria]
│   ├── /kormos/producto/[slug]      Ficha: colores, medidas, descarga libre, añadir al carrito
│   ├── /kormos/atelier              Atelier · Mobiliario a la medida
│   ├── /kormos/proyectos(/[slug])   Portafolio Kormós (mosaicos)
│   ├── /kormos/nosotros             Historia, valores, misión, visión
│   └── /kormos/contacto
│
├── /aracena                         Inicio Aracena Studio
│   ├── /aracena/proyectos(/[slug])  Portafolio de renders
│   ├── /aracena/paquetes            Catálogo de paquetes de render (precio RD$/US$)
│   ├── /aracena/servicios
│   └── /aracena/contacto
│
├── [Cajón lateral] Carrito / Selección   (solo en Kormós)
└── /admin                           Panel de administración (privado)
```

**Orden de las marcas en la portada:** para que no haya jerarquía visible, propongo el **orden alfabético (Aracena · Arpad · Kormós)**, con tres paneles del mismo ancho. Que Arpad sea la principal se nota en el contenido (su sección es la más completa), no en la portada.

**Menú de Arpad:** Logo · Proyectos · Servicios · Proceso · Estudio · **Grupo ▾** (Mobiliario → Kormós · Renders → Aracena) · Contactar *(botón)*

**Menú de Kormós** (inspirado en Minotti):
Logo · Colección 2026 · Catálogo · Atelier · Proyectos · Nosotros · **Grupo ▾** (Arquitectura → Arpad · Renders → Aracena) · Contacto · 🛒 *(contador)*

**Menú de Aracena:** Logo · Proyectos · Paquetes · Servicios · **Grupo ▾** (Arquitectura → Arpad · Mobiliario → Kormós) · Contactar *(botón)*

Un pequeño selector en la cabecera (los tres monogramas, mismo tamaño) permite saltar entre marcas sin volver a la portada.

---

## 7. Flujos clave

Todos los mensajes van a **un único WhatsApp: `https://wa.me/18494722473`**, y empiezan indicando la marca.

### 7.1 Flujo de compra y cotización (Kormós)
```
Entra → Catálogo → Producto → elige color (las imágenes cambian)
      → ve medidas, materiales y estado
      → [Descargar .skp / .dwg / ficha PDF]  (libre, directo)
            └→ aviso: "¿Quieres saber cuánto cuesta? Cotiza por WhatsApp"
      → [Consultar disponibilidad] → WhatsApp (sin mostrar cantidades)
      → [Agregar al carrito] → sigue explorando → abre el carrito
      → revisa cantidades y colores → (opcional: nombre y nota)
      → [Solicitar cotización] → WhatsApp con el mensaje ya escrito
      → se responde a mano y se agenda
```

**Ejemplo de mensaje de cotización:**
```
Hola, escribo desde la web de KORMÓS 👋
Me gustaría cotizar estas piezas:

1. Mesita de noche AURA — Nogal — 40×50×40 cm — x2 — KR-MN-014
2. Sofá LÍNEA — Lino arena — 240×95×80 cm — x1 — KR-SF-003

Nombre: ____
```

**Ejemplo de consulta de disponibilidad:**
```
Hola, escribo desde la web de KORMÓS 👋
¿Está disponible la Mesita de noche AURA en color Nogal (KR-MN-014)?
```
> Nota técnica: los enlaces `wa.me` aceptan texto largo, pero conviene **mantenerlo por debajo de unos 1,500 caracteres**. Para carritos grandes se resume con códigos.

### 7.2 Flujo Atelier (Kormós)
Formulario corto: tipo de pieza, medidas aproximadas, material o color deseado, espacio, presupuesto opcional. Al enviar, se abre WhatsApp con el brief (*"Hola, escribo desde KORMÓS · Atelier…"*). *(La foto de referencia la adjunta el cliente en WhatsApp: los enlaces `wa.me` no envían archivos.)*

### 7.3 Flujo de paquetes (Aracena)
Paquetes → tarjeta del paquete (qué incluye, plazo, precio) → **"Solicitar paquete"** → WhatsApp: *"Hola, escribo desde la web de ARACENA STUDIO. Me interesa el paquete Render Interior Premium (US$ X)…"*.

### 7.4 Flujo de Arpad y de los portafolios
Portafolio (mosaicos) → detalle del proyecto → **"Contactar"** → WhatsApp: *"Hola, escribo desde la web de ARPAD STUDIO. Vi el proyecto X y me interesa el servicio de Y"*.

### 7.5 Flujo de administración
```
/admin → inicia sesión → Productos → Nuevo
  → datos (nombre, categoría, medidas, materiales, estado)
  → precio + moneda (RD$/US$) + interruptor "mostrar precio / a consultar"
  → variantes de color (nombre + muestra + fotos de cada color)
  → imágenes en ambiente → archivos (.skp, .dwg, .pdf), al nivel de detalle que Kormós decida
  → Publicar → (P2) aviso por correo a los suscriptores
```

---

## 8. Modelo de datos (propuesto)

- **Marca**: nombre, slug, logos, colores, WhatsApp (por defecto el único: 18494722473), prefijo del mensaje ("Hola, escribo desde la web de …"), correo, redes, textos (intro, misión, visión, valores).
- **Categoría**: marca, nombre, slug, orden, imagen de portada.
- **Producto** (Kormós):
  - nombre, slug, **código**, colección (ej. "2026"), categoría, destacado, orden
  - descripción corta y larga
  - **dimensiones**: alto, ancho, profundidad (cm) + texto libre
  - **materiales**: lista (ej. nogal macizo, MDF lacado, lino…)
  - **variantes de color**: [{ nombre, muestra (hex o foto de textura), galería de fotos }]
  - galería en ambiente
  - **precio**, **moneda (`RDS` / `USD`, por producto)**, **mostrarPrecio** (sí/no → "Precio a consultar")
  - **estado**: `disponible` · `bajo_pedido` (producción, pago contra entrega) · `proximamente` · `agotado`. **Sin campo de cantidad.**
  - **archivos**: { skp, dwg, pdf ficha }, todos de **descarga libre**
- **Paquete de render** (Aracena): nombre, descripción, qué incluye (lista), plazo de entrega, precio + moneda + mostrarPrecio, imagen de ejemplo, orden, destacado.
- **Proyecto** (las 3 marcas): marca, título, ubicación, tipo (residencial, comercial…), año, portada, galería, descripción, servicios aplicados, productos usados (enlace a Kormós).
- **Servicio** (las 3 marcas): marca, título, descripción, imagen, "precio desde" opcional, orden.
- **Paso de proceso** (Arpad): número, título, descripción.
- **Miembro del equipo** (Arpad): nombre, cargo, foto, bio corta.
- **Testimonio** (Arpad, reutilizable en las otras): cliente, texto, proyecto relacionado, foto opcional.
- **Suscriptor** (P2): correo, marcas de interés, fecha, consentimiento.
- **Idioma:** los campos de texto se marcan como traducibles desde el inicio (español ahora, inglés después).

---

## 9. Propuesta técnica

| Capa | Recomendación | Por qué |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Es el mismo stack de Entre Dos Interiores, así que reutilizamos componentes y animaciones. Tiene buen SEO y optimiza las imágenes |
| Idioma | Rutas preparadas para i18n (`/es/...` implícito, `/en/...` futuro) y textos en diccionarios | Español en la v1, inglés sin rehacer nada |
| Estilos | CSS con **variables por marca** (`[data-brand="arpad"]`, etc.) + CSS Modules | Una sola interfaz con tres temas, como pidió el cliente |
| Animaciones | CSS keyframes + IntersectionObserver. SVG para el trazo de los monogramas. *Opcional:* Lenis para el scroll suave | Ligero; replica la sensación de Minotti y Entre Dos |
| Panel admin / CMS | **Payload CMS** integrado en el mismo proyecto Next.js, con **SQLite en local** y PostgreSQL al publicar. Localización de campos activada | Da el panel `/admin`, la subida de archivos, los roles y los formularios sin construirlos desde cero. Corre 100% local |
| Archivos | Carpeta `media/` local. En producción, almacenamiento de objetos (S3 o Cloudflare R2) | Los .skp y .dwg pesan; conviene que no vivan en el servidor web |
| Carrito | Estado en el navegador (localStorage), sin backend | No hay pago, solo se arma el mensaje de WhatsApp |
| WhatsApp | Enlaces `https://wa.me/18494722473?text=` generados en el cliente | Sin APIs ni costos |
| Correo (P2) | Resend o Brevo para avisos y boletín | Se activa al tener dominio |
| Imágenes | `next/image` (AVIF/WebP, tamaños responsivos, carga diferida) | Las fotos son protagonistas y deben cargar rápido |
| 3D (P3) | `<model-viewer>` con archivos GLB | Vista 3D o en realidad aumentada de la pieza, como valor añadido |

**Fuentes tipográficas (propuesta):**
- Arpad: sans humanista (como su logotipo), por ejemplo *Montserrat* o *Nunito Sans*.
- Kormós: sans geométrica ligera y muy espaciada, alineada con el logotipo. Candidatas: *Jost* o *Raleway* (la de Minotti), pesos 300 y 400.
- Aracena: serif de remates finos para títulos (*Cormorant* o *Marcellus*) + sans para el texto.
- Portada: una tipografía neutra común (por ejemplo, la misma sans ligera) para no favorecer a ninguna marca.

**Ejecución local:** `npm run dev` en `http://localhost:3000`. Recomiendo inicializar **git solo en local** (sin remoto) para tener historial y poder deshacer cambios. *Se sube a GitHub solo si lo decides.*

---

## 10. Plan de implementación por fases

> Tamaño relativo: **S** pequeño · **M** mediano · **L** grande.

### Fase 0: Preparación y decisiones · S ✅
- Decisiones cerradas (sección 4).
- Pedir los insumos de la sección 11. Mientras llegan, se trabaja con **fotos de muestra** (lo acordado en la reunión).

### Fase 1: Base del proyecto y sistema visual · M ✅ (16-oct-2026)
- Crear el proyecto Next.js en `KORMOS/web/`, con la estructura preparada para i18n.
- Variables de diseño por marca (colores, tipografía, espaciados, transiciones).
- Componentes base: cabecera, menú hamburguesa, menú "Grupo", footer (con Trinitaria Digital), botón flotante de WhatsApp, tarjetas, botones y mosaico de imágenes.
- Utilidad única para generar los mensajes de WhatsApp (prefijo por marca).
- Precarga con **monograma animado** (trazo → relleno → velo).
- **Entregable:** esqueleto navegable en localhost con los tres temas.

### Fase 2: Portada · M ✅ (16-oct-2026)
> Hecho en `web/`, en local. También quedaron inicios provisionales de las tres marcas (hero, manifiesto, mosaico, servicios o colección, grupo y contacto) con fotos de muestra. Reglas de movimiento aplicadas (Emil Kowalski + UI-UX-PRO-MAX): `web/DISENO-Y-MOVIMIENTO.md`.
- **Tres paneles iguales** (Aracena · Arpad · Kormós), cada uno con su slideshow de fotos (Ken Burns y fundidos) y su logo.
- Entrada: **los tres monogramas se dibujan a la vez**. Al pasar el ratón, la foto del panel se acerca (solo transform, sin cambiar anchos), aparece "Entrar" y los otros se atenúan.
- Versión móvil: los paneles se apilan.
- **Entregable:** portada terminada con fotos de muestra.

### Fase 3: Arpad y Aracena · M-L ✅ (16-oct-2026)
> Hecho: **Arpad** → `/arpad/proyectos` (filtros), `/arpad/proyectos/[slug]` (ficha, antes/después con deslizador, galería con visor), `/arpad/servicios` (pestañas), `/arpad/proceso`, `/arpad/estudio` (equipo, materialidad). **Aracena** → `/aracena/proyectos` (filtros), detalle con créditos y `/aracena/paquetes` (paquetes, formulario "Arma tu solicitud" que envía por WhatsApp, preguntas frecuentes). Contenido de muestra en `web/src/content/` (proyectos de Instagram). **Pendiente del cliente:** nombres reales de los proyectos, textos de servicios y proceso por validar, fotos del equipo, testimonios (no se inventaron) y precios de los paquetes.
- **Arpad (marca principal):** inicio con proyectos destacados, portafolio en mosaico con filtros, detalle del proyecto, servicios (pestañas), proceso (pasos), estudio (equipo, trayectoria, testimonios) y contactar.
- **Aracena:** inicio, portafolio de renders, **catálogo de paquetes** (tarjetas con precio RD$/US$ y "Solicitar paquete") y contactar.
- Comparten la plantilla de "estudio".
- **Entregable:** las dos marcas navegables con contenido de muestra.

### Fase 4: Kormós, la parte visible · L ✅ (16-oct-2026)
> Hecho: `/kormos/catalogo` (26 piezas de la Colección Origen + piezas a medida, filtro por categoría con enlace compartible `#categoria`), `/kormos/catalogo/[slug]` (galería que cambia con el acabado, selector de madera/tapizado, precio RD$/US$ o "Precio a consultar", estado sin cantidades, "Consultar disponibilidad", descargas .skp/.dwg/.pdf libres con invitación a cotizar), **Mi selección** (carrito en el navegador, cajón lateral, mensaje de cotización por WhatsApp) y `/kormos/atelier` (brief de pieza a medida por WhatsApp). Datos en `web/src/content/products.ts`. **Pendiente del cliente:** medidas reales, precios (el catálogo Canva muestra US$120 en todas las piezas: solo se dejó en el Ottoman Nórdico y hay que confirmarlo), archivos .skp/.dwg/.pdf, fotos por acabado (por ahora solo el bench tiene dos), nombres de las mesas auxiliares 02–04 y confirmación de las texturas de madera.
- Inicio al estilo Minotti: hero dividido, Colección 2026, categorías, proyectos destacados, Atelier y suscripción.
- Catálogo con filtros y etiqueta de estado.
- **Ficha de producto**: galería, selector de color que cambia las imágenes, medidas, materiales, precio (RD$/US$) o "Precio a consultar", estado, **"Consultar disponibilidad"**, **descarga libre** (.skp, .dwg, PDF) con invitación a cotizar.
- **Carrito** (cajón lateral) y mensaje de WhatsApp.
- Atelier, Proyectos (mosaicos), Nosotros y Contacto.
- Por ahora los datos salen de **archivos JSON locales** (contenido de muestra).
- **Entregable:** el flujo completo de Kormós funcionando de punta a punta.

### Fase 5: Pulido y demo · M ✅ (16-oct-2026)
> Hecho: **SEO** (título, descripción, canonical y Open Graph en cada página; 74 imágenes 1200×630 para compartir por WhatsApp; `sitemap.xml` con 47 URL; `robots.txt`; JSON-LD de las tres empresas, `Product` y migas de pan), **iconos por marca**, **página 404**, **accesibilidad** (axe-core WCAG 2.2 AA: 0 fallos en 18 rutas; Lighthouse 100), **móvil** (sin scroll horizontal a 375 px en ninguna ruta) y **rendimiento** (intro acortada a ~1.9 s y solo en portada e inicios; slideshows que cargan foto actual + siguiente; fuentes secundarias sin precarga; fichas con HTML completo en línea). Lighthouse móvil en producción: portada 88–91 / 100 / 100 / 100; Kormós 87; proyectos 88; ficha de producto 76–84. **Al publicar:** definir `NEXT_PUBLIC_SITE_URL` con el dominio.
- Responsive (móvil primero, porque la mayoría llegará desde Instagram y WhatsApp), accesibilidad, rendimiento (Lighthouse), SEO (metadatos, Open Graph para compartir por WhatsApp) y favicon por marca.
- Revisar todos los mensajes de WhatsApp en un móvil real.
- **Entregable:** demo visual lista para presentar al cliente.

### Fase 6: Panel de administración · L ✅ (17-oct-2026)
> Hecho: **Payload CMS 3.91** dentro del mismo proyecto Next (grupos `(site)` y `(payload)`, panel en `/admin` en español, SQLite en local). Colecciones: **Productos** (fotos generales y por acabado, medidas, materiales, precio RD$/US$ con interruptor, estado sin cantidades, archivos .skp/.dwg/.pdf), **Categorías**, **Acabados** (maderas, telas y colores reutilizables), **Proyectos** (Arpad y Aracena, antes/después, créditos), **Paquetes de render**, **Preguntas de Aracena**, **Fotos** (difuminado de carga y detección de recortes al subir), **Archivos** (solo .skp/.dwg/.pdf) y **Usuarios**. Orden por arrastre, "Visible en el sitio", vista previa y textos listos para inglés. El sitio lee el panel con caché que se invalida al guardar (probado en desarrollo y producción). Imágenes para compartir generadas al vuelo. Contenido de muestra cargado con `npm run seed`. Servicios, proceso, equipo, testimonios y datos de marca pasaron al panel en la Fase 7.
- Integrar Payload CMS: colecciones Marca, Categoría, Producto, Paquete, Proyecto, Servicio, Proceso, Equipo y Testimonio.
- Subida de fotos por color y de archivos .skp, .dwg y .pdf. Precio con moneda e interruptor de visibilidad.
- Cambiar los datos JSON por los del CMS.
- **Entregable:** se pueden subir y editar productos, paquetes y proyectos sin tocar código.

> **Replanificación (19-oct-2026).** Tras revisar lo hecho en las fases 1 a 6 se reordenó lo que queda. Antes eran dos fases (suscripción y publicación); ahora son cinco. Decisiones de Jesús:
> - **El panel se renueva personalizando Payload** (inicio, listas, formularios, logo y colores con las piezas que Payload permite cambiar), no con un panel propio desde cero. Así las actualizaciones de Payload siguen siendo fáciles.
> - **Una sola persona o equipo maneja las tres marcas.** No hace falta un usuario por marca.
> - **La publicación debe ser muy guiada:** quien publica nunca ha comprado un dominio ni usado un hosting.
>
> Hallazgos de la revisión:
> - El formulario de suscripción **no guardaba el correo** (avisaba que "se activará cuando el sitio esté publicado"). Se conectó en la Fase 9.
> - El proyecto ya está en GitHub (`jesusx26x/Kormos`). Lo que dice este documento de "sin GitHub" es historia.

> **Decisiones del 19-oct-2026 (tarde), de Jesús:**
> - **Trinitaria Digital no participa** en el desarrollo ni en la publicación. Se quitó "Desarrollado por Trinitaria Digital" de la portada y del pie de página.
> - **Vercel en el plan gratis (Hobby) por ahora**; solo se paga el dominio. **Riesgo aceptado:** las reglas de Vercel dicen que Hobby es para uso personal y no comercial, y un sitio que promociona un negocio cuenta como comercial. Vercel podría pausar el proyecto; en ese caso se activa Pro (US$20 al mes) y el sitio sigue igual. Límites que importan en Hobby: 1 GB para fotos y archivos (los .skp pesan) y una compilación a la vez.

### Fase 7: Completar el panel · M ✅ (19-oct-2026)
> Hecho: en el panel, **Servicios** (por marca; hoy los usa Arpad en su inicio y en `/arpad/servicios`), **Equipo** (foto opcional; sin foto salen las iniciales), **Testimonios** (con enlace opcional al proyecto; la sección solo aparece si hay alguno), **Proceso de trabajo (Arpad)** y **Datos de las marcas** (frase, presentación, Instagram y correo de cada una, en Ajustes). El sitio los lee con caché que se invalida al guardar (probado: editar un servicio, el proceso y los datos de marca, y crear un testimonio se ve en la siguiente visita). `npm run seed` ahora carga cada parte solo si está vacía, así que en una base que ya tiene el catálogo añade lo nuevo sin tocar lo demás. **Sigue en código:** los títulos y frases fijas de cada página, la lista de maderas de Kormós, las tarjetas de materialidad de Arpad y las fotos del proceso de Aracena. Se pueden pasar al panel si el cliente quiere cambiarlos a menudo. **Pendiente del cliente:** validar los textos de servicios y proceso, confirmar nombres y fotos del equipo y enviar testimonios reales (no se inventaron).
- Pasar al panel lo que todavía vive en el código: **servicios** (las tres marcas), **proceso** de Arpad, **equipo**, **testimonios** y **datos de cada marca** (textos de presentación, correo y redes).
- El sitio lee esos datos del panel, igual que ya hace con productos y proyectos.
- **Entregable:** el contenido que el cliente cambia a menudo (servicios, proceso, equipo, testimonios y datos de marca) se edita sin tocar código.

### Fase 8: Panel renovado, diseño y experiencia · L ✅ (19-oct-2026, falta la prueba con el cliente)
> Hecho según `DISENO-PANEL.md`. Por decisión de Jesús ("haz todo lo necesario hasta terminar") no hubo bocetos aparte: se construyó directo y las capturas hacen de bocetos. **Identidad:** entrada con los tres monogramas, ícono propio, paleta cálida del sitio (claro y oscuro), Jost y Cormorant. **Inicio propio:** accesos rápidos, una tarjeta por marca con cifras que llevan a la lista filtrada, "Qué falta en las piezas" y "Últimos cambios". **Listas:** foto y nombre en una sola columna que abre la ficha, estado con color, interruptor "Visible" que guarda al instante, filtros de un clic. **Fichas:** tarjeta "Antes de publicar / Lista para publicar" que se marca sola y "Ver en el sitio". **Sin nada técnico:** sin pestaña API, sin "— Español", sin selector de idioma y sin Gravatar. Mensajes de confirmación que dicen qué pasa en el sitio. Probado en desarrollo y producción, en escritorio y móvil (390 px sin desbordes), en modo claro y oscuro. Ocultar y mostrar desde la lista se refleja en el sitio. Guía de uso para el cliente: `GUIA-DEL-PANEL.md`. **Pendiente:** la sesión de prueba con la persona que va a administrar (guion al final de la guía). **No incluido:** vista previa en vivo dentro del panel (exige borradores; se puede añadir si el cliente lo pide).
Objetivo: que quien administra el sitio, sin conocimientos técnicos, pueda subir y cambiar contenido rápido y sin miedo a equivocarse.
1. **Identidad propia:** pantalla de entrada con las tres marcas, logo e ícono del grupo, colores y tipografía, y modo claro y oscuro.
2. **Página de inicio útil:** una tarjeta por marca con cifras (piezas visibles, ocultas, agotadas, proyectos), accesos grandes ("Agregar pieza", "Agregar proyecto", "Agregar paquete"), lo que le falta a cada pieza (sin foto, sin precio, sin archivos, fotos sin descripción) y los últimos cambios.
3. **Listas visuales:** foto en miniatura en cada fila, estado con etiqueta de color, vista en cuadrícula tipo catálogo, filtros de un clic y mostrar u ocultar una pieza desde la lista.
4. **Formularios guiados:** pasos claros con una lista de "lista para publicar", vista previa en vivo de cómo queda en el sitio, acabados elegidos viendo la muestra y fotos que se suben arrastrándolas.
5. **Menú claro:** ordenado por marca (Arpad, Kormós, Aracena) más Biblioteca y Ajustes, con íconos. Sin términos técnicos y con mensajes de confirmación amables. Visto en el panel actual y por quitar: la pestaña "API" en cada ficha, el "— Español" detrás de cada campo (solo hay un idioma), el selector de idioma con una sola opción y la foto de usuario rota (se pide a un servicio externo).
6. **Prueba con el cliente:** el cliente sube una pieza solo mientras anotamos dónde se traba. Se corrige y se entrega una guía corta de uso.
- Antes de programar se presentan **bocetos** del inicio, la lista de piezas y el formulario de una pieza para su aprobación.
- Solo se usan los puntos de personalización oficiales de Payload (componentes propios y variables de estilo), sin modificar Payload por dentro.
- **Entregable:** panel con la identidad del grupo, probado por el cliente.

### Fase 9: Suscripción y avisos · M (P2) ✅ (19-oct-2026)
> Hecho: el formulario del pie **guarda el correo** en el panel (**Contactos → Suscriptores**), con la marca desde la que se suscribió, en minúsculas y sin duplicados. Si el correo ya estaba, responde igual para no revelar quién está suscrito. Tiene un campo trampa contra robots y un texto de para qué se usa el correo. **Doble confirmación** (añadida al revisar la seguridad): el correo queda "Por confirmar" hasta que la persona pulsa el botón del correo de confirmación (`/confirmar`); solo los activos reciben avisos. Evita que alguien suscriba direcciones ajenas, lo que traería quejas de spam, y deja constancia del consentimiento (Ley 172-13). **Exportación** a CSV que abre Excel. **Baja** en `/baja?t=…` con un botón de confirmación (los lectores de correo abren los enlaces solos y darían de baja sin querer). **Aviso por correo** desde la ficha de cada pieza o proyecto: botón "Avisar ahora", una sola vez por ficha, solo si está visible y guardada, y con un enlace de baja personal en cada correo. Si no sale ningún correo, se puede reintentar. Proveedor: **Resend** (`RESEND_API_KEY`, `EMAIL_FROM`); sin clave, el botón explica que falta configurarlo. Probado: suscribir, repetir, correo inválido, acceso anónimo bloqueado (403/401), exportación, baja con enlace válido y falso, aviso con la ficha oculta, repetido y con el proveedor caído. **No incluido:** contador de descargas y clics a WhatsApp (opcional; cada clic cambiaría la ficha y vaciaría la caché del catálogo, así que necesita un registro aparte). **Límite:** los envíos van uno a uno (unos 100 por minuto); con más de unos 300 suscriptores hay que pasar al envío por lotes.
- El formulario del footer guarda los correos de verdad. Lista de suscriptores en el panel, con exportación.
- Aviso por correo al publicar una pieza o un proyecto (se activa cuando haya dominio y correo).
- *Opcional:* contar descargas y clics a WhatsApp por pieza, y mostrarlos en el inicio del panel.

### Fase 10: Material real del cliente · en paralelo
- Cambiar fotos, textos, precios, medidas y archivos .skp/.dwg/.pdf de muestra por los originales (lista de la sección 11).
- Confirmar los derechos de cada foto (sección 6 de `ADN-DE-MARCA.md`).
- Se hace desde el panel a medida que llegue el material.

### Fase 11: Publicación guiada · L — código y guía listos (19-oct-2026); falta publicar
> Hecho: **`GUIA-DE-PUBLICACION.md`**, paso a paso para quien nunca ha publicado: qué es cada pieza, cuánto cuesta, qué pulsar y cómo comprobarlo. **Proveedores:** Vercel Pro (US$20 al mes; el plan gratis no permite negocios), Neon gratis, Vercel Blob (5 GB incluidos) y Resend (gratis hasta 100 correos por día), más el dominio (`.com` unos US$12 al año; `.do` unos US$110). **Código listo para la nube:** PostgreSQL cuando hay `DATABASE_URL`/`DATABASE_URI` `postgres://`, y Vercel Blob para fotos y archivos cuando hay `BLOB_READ_WRITE_TOKEN`. Los archivos se suben y se sirven directo desde Blob, sin pasar por el servidor, por el límite de 4.5 MB de Vercel y porque un .skp puede pesar 150 MB. Migración inicial en `src/migrations`; `vercel-build` migra y compila. **Arreglos encontrados al probar:** la foto subida directo a Blob llega al servidor como archivo temporal (antes habría fallado cada subida), la imagen para compartir leía la foto del disco, y con la base vacía la compilación se caía (Next exige al menos una ficha). **Pasar el contenido** de la computadora a la nube con `npm run contenido:exportar` / `contenido:importar`, que reconecta las relaciones; `contenido:respaldo` saca copia del sitio publicado. **Probado con PostgreSQL real:** migración, carga, compilación como en Vercel (también con la base vacía), sitio, panel, imagen para compartir y edición que se refleja en el sitio. La importación dio un contenido idéntico al local (52 comprobaciones con la misma huella). **Sin probar:** Vercel Blob y Resend reales (necesitan las cuentas). **Pendiente (humano):** decidir a nombre de quién quedan las cuentas y si se usa el equipo de Vercel de Trinitaria, escoger el dominio y seguir la guía.
Quien publica nunca lo ha hecho, así que esta fase es **una guía paso a paso**, no una lista técnica:
- Un documento `GUIA-DE-PUBLICACION.md` en el que cada paso dice **qué es** (en palabras simples), **para qué sirve**, **cuánto cuesta**, **qué hacer exactamente** (qué botón, qué escribir) y **cómo comprobar que quedó bien**.
- La persona solo crea las cuentas, paga y copia los datos que la guía le pide. Toda la configuración técnica la hace el desarrollo.
- Las cuentas y el dominio quedan **a nombre del dueño del negocio** (se decide al iniciar la fase), con verificación en dos pasos.
- Pasos previstos: 1) escoger y comprar el dominio; 2) crear la cuenta de hosting y conectarla con GitHub; 3) crear la base de datos en la nube; 4) crear el almacenamiento de fotos y archivos; 5) conectar el dominio; 6) pasar el contenido del panel local a la nube; 7) correo y avisos (Fase 9); 8) revisión final y salida al público; 9) qué hacer después (copias de seguridad, cómo actualizar, a quién llamar si algo falla).
- **Propuesta a confirmar al iniciar la fase:** hosting, base de datos y archivos en un mismo proveedor (por ejemplo Vercel con su base de datos y su almacenamiento) para que todo se maneje desde un solo lugar.
- **Punto técnico a resolver:** los modelos .skp pueden pesar hasta 150 MB y algunos hostings limitan lo que se sube en una sola petición. Los archivos deben subirse directo al almacenamiento, no a través del servidor del sitio.
- Traducción al inglés cuando se decida.

**Orden:** 1 → 2 → 3 → 4 → 5 (demo al cliente) → 6 → 7 → 8 → 9 → 11, con la 10 en paralelo desde ya.
Arpad, la marca principal, queda visible desde la Fase 3. Kormós, la más compleja, llega después sobre una base ya probada. La 7 va antes que la 8 para que el inicio del panel renovado incluya todo el contenido.

---

## 11. Insumos que hay que pedir al cliente (las 3 carpetas)

Estructura sugerida para que lo envíen:
```
ARPAD/
├── 01-marca/        logos en vector (SVG/AI/PDF), manual de marca, tipografías
├── 02-textos/       intro, qué es, misión, visión, valores, trayectoria
├── 03-servicios/    arquitectura, diseño, construcción (con precios si los hay)
├── 04-proceso/      pasos de trabajo
├── 05-equipo/       fotos y bios
├── 06-testimonios/
└── 07-proyectos/    fotos y renders por proyecto
KORMOS/
├── 01-marca/  02-textos/
├── 03-productos/
│   └── [codigo-nombre]/   fotos por color, fotos en ambiente, ficha.txt (medidas,
│                          materiales, precio, moneda, estado), .skp, .dwg, .pdf
└── 04-proyectos/    fotos de piezas instaladas
ARACENA/
├── 01-marca/  02-textos/
├── 03-paquetes/     nombre, qué incluye, plazo, precio y moneda de cada paquete
└── 04-proyectos/    renders en alta
```

**Lista de control:**
- [ ] Logos **vectoriales** de las 3 marcas (el PDF que hay en la carpeta de Aracena es de Arpad)
- [ ] Logo limpio de Aracena (sin textura de papel)
- [ ] Manual de marca o, como mínimo, colores y tipografías oficiales de cada marca
- [ ] Textos de las 3 marcas (la reunión dijo "eso lo podemos fabricar": ¿los redacto yo como borrador?)
- [ ] **Arpad:** proyectos destacados, proceso, equipo, testimonios y trayectoria
- [ ] **Aracena:** lista de paquetes de render con precio y moneda
- [ ] **Kormós:** al menos **6–10 productos de muestra** con datos completos, fotos **por color** y archivos .skp, .dwg y .pdf de al menos 2 productos
- [ ] 4–6 proyectos por marca para los mosaicos
- [ ] Fotos de gran formato para la portada (una por marca como mínimo, mismo estilo de luz y encuadre para que ninguna destaque)
- [ ] Correos y redes de Arpad y Aracena (el WhatsApp es el único 849-472-2473 ✅)

---

## 12. Decisiones cerradas

Todas las decisiones abiertas se cerraron el 16-oct-2026. Ver la **sección 4**.

Quedan detalles menores que se pueden resolver durante el desarrollo:
- Orden de los paneles en la portada (propuesta: alfabético).
- Nombres y precios definitivos de los paquetes de Aracena.
- Si se redactan los textos como borrador o los entrega el cliente.

---

## 13. Riesgos y cómo mitigarlos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Fotos insuficientes o de baja calidad (el diseño depende de la fotografía) | Alto | Empezar con fotos de muestra y definir desde ya un estándar fotográfico (fondo neutro, misma luz, mismo encuadre) |
| No hay fotos por cada color | Alto | Permitir colores con solo una muestra de textura si falta la foto. Recomendar renders por color (Aracena puede hacerlos: sinergia del grupo) |
| Portada desequilibrada (una marca "pesa" más por sus fotos) | Medio | Mismo ancho, mismo tratamiento de color en las fotos y monogramas del mismo tamaño |
| Copia de diseños con los archivos descargados (**riesgo aceptado**, descarga libre) | Medio | Kormós decide el detalle de cada archivo. Invitación a cotizar tras la descarga. Mini-formulario disponible en el futuro si se necesita |
| Logos solo en PNG o raster | Medio | Pedir vectores. Si no los hay, redibujar los monogramas en SVG (son geométricos y sencillos) |
| Crecimiento del alcance (3D, pagos, cuentas, inglés) | Medio | Fases claras: lo P2 y P3 no bloquea la v1 |
| Los archivos .skp y .dwg pesan mucho en el futuro hosting | Bajo hoy | Almacenamiento de objetos aparte (fase 8) |
| Todos los mensajes llegan al mismo WhatsApp y se mezclan | Bajo | Cada mensaje empieza con la marca. Se pueden usar etiquetas de WhatsApp Business |

---

## 14. Próximo paso inmediato

1. Enviar al cliente la lista de insumos de la sección 11.
2. Arrancar **la Fase 1 (base y sistema visual) y la Fase 2 (portada con los tres logos)** con los logos y colores que ya tenemos y fotos de muestra.
