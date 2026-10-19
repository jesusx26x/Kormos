# Aracena Studio · Arpad Studio · Kormós

Sitio web único para las tres empresas del grupo, en un solo dominio:

| Marca | Qué hace | En la web |
|---|---|---|
| **ARPAD STUDIO** (marca principal, 2020) | Arquitectura, diseño de interiores, E-Design, remodelación y construcción | Proyectos con filtros y antes/después, servicios, proceso y estudio |
| **KORMÓS** (2025) | Ebanistería y mobiliario a medida | Catálogo con acabados, "Mi selección" que se cotiza por WhatsApp, descarga libre de .skp/.dwg/.pdf y Atelier |
| **ARACENA STUDIO** (2018) | Renders y visualización arquitectónica | Portafolio y paquetes de render |

La portada presenta las tres marcas al mismo nivel. Todas las llamadas a la acción terminan en un único WhatsApp (849-472-2473), con un mensaje ya escrito que dice de qué marca viene. No hay pagos ni cuentas de cliente.

## Tecnología

- **Next.js 16** (App Router, Cache Components) + React 19 + TypeScript + CSS Modules
- **Payload CMS 3** para el panel de administración en `/admin`. Usa SQLite en local; publicado, PostgreSQL (Neon) y Vercel Blob para fotos y archivos.
- **sharp** y **potrace** para preparar fotos, logos e imágenes para compartir
- Requiere **Node 24**

## Arrancar en local

```bash
cd web
npm install
cp .env.example .env    # y rellena PAYLOAD_SECRET
npm run seed            # base de datos, fotos y usuario de prueba del panel
npm run dev
```

- Sitio: http://localhost:3000
- Panel: http://localhost:3000/admin. El usuario de prueba queda en `web/.env`.

En [`web/README.md`](web/README.md) están los detalles: estructura, scripts, panel y decisiones técnicas.

## Estructura del repositorio

| Carpeta o archivo | Qué hay |
|---|---|
| [`web/`](web/) | El sitio y el panel (código) |
| [`ANALISIS-Y-PLAN.md`](ANALISIS-Y-PLAN.md) | Análisis, decisiones y plan por fases, con el estado de cada fase |
| [`ADN-DE-MARCA.md`](ADN-DE-MARCA.md) | Identidad de cada marca: voz, paletas, catálogo y políticas |
| [`DISENO-PANEL.md`](DISENO-PANEL.md) | Diseño del panel de administración |
| [`GUIA-DEL-PANEL.md`](GUIA-DEL-PANEL.md) | Guía de uso del panel para el cliente |
| [`GUIA-DE-PUBLICACION.md`](GUIA-DE-PUBLICACION.md) | Cómo publicar el sitio, paso a paso |
| [`web/DISENO-Y-MOVIMIENTO.md`](web/DISENO-Y-MOVIMIENTO.md) | Reglas de animación, interfaz y accesibilidad |
| [`SOLICITUD-DE-MATERIAL.html`](SOLICITUD-DE-MATERIAL.html) | Lista del material pendiente de recibir del cliente |

## Estado

| Fase | Estado |
|---|---|
| 1–2. Base, sistema visual y portada | ✅ |
| 3. Arpad y Aracena | ✅ |
| 4. Kormós: catálogo, ficha, selección y Atelier | ✅ |
| 5. Pulido: móvil, rendimiento, SEO y accesibilidad | ✅ |
| 6. Panel de administración (Payload) | ✅ |
| 7. Completar el panel (servicios, proceso, equipo, testimonios y datos de marca) | ✅ |
| 8. Panel renovado: diseño y experiencia | ✅ (falta la prueba con el cliente) |
| 9. Suscripción y avisos por correo | ✅ (el envío se activa al publicar) |
| 10. Material real del cliente | En paralelo |
| 11. Publicación guiada (dominio, hosting, base de datos y archivos en la nube) | Código y guía listos · falta publicar |

Las fotos y los textos actuales son **de muestra**, tomados de Instagram y del catálogo de Canva. Se cambiarán por los originales cuando el cliente los envíe.
