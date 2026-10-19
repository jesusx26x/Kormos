# Diseño del panel de administración (Fase 8)

Fecha: 19 de octubre de 2026. Decisiones de Jesús: se personaliza Payload (no se hace un panel propio) y una sola persona o equipo maneja las tres marcas.

**Para quién es:** una persona del negocio, sin conocimientos técnicos, que entra pocas veces por semana para subir una pieza, cambiar un estado o publicar un proyecto. Necesita saber dónde está, qué le falta a cada ficha y qué pasa en el sitio cuando guarda.

## Principios

1. **Lo visual primero.** Las piezas y los proyectos se reconocen por la foto, no por el nombre: cada lista lleva miniatura.
2. **El estado se ve de un vistazo.** Disponible, bajo pedido, próximamente y agotado llevan un color fijo. "Visible en el sitio" es un interruptor, no la palabra "verdadero".
3. **Decir qué falta, no qué está mal.** Cada ficha muestra una lista de "lista para publicar" que se marca sola mientras se llena.
4. **Nada técnico a la vista.** Sin pestaña "API", sin "— Español" detrás de cada campo, sin selector de idioma con una sola opción y sin foto de usuario rota.
5. **La identidad del grupo, sin favorecer una marca.** Fondo cálido del sitio, tipografía Jost y titulares en Cormorant, y los tres monogramas juntos en la entrada.

## Pantallas

### Entrada
- Los tres monogramas al mismo tamaño, el saludo "Panel del sitio" y una frase de ayuda.
- Fondo cálido del sitio.

### Inicio
- **Saludo** con el nombre de quien entra y la fecha.
- **Accesos grandes:** Agregar pieza, Agregar proyecto, Agregar paquete y Subir fotos.
- **Una tarjeta por marca** con su color, su monograma y sus cifras:
  - Kormós: piezas visibles, ocultas, agotadas y bajo pedido.
  - Arpad: proyectos y servicios.
  - Aracena: proyectos y paquetes.
  - Cada cifra lleva a la lista ya filtrada.
- **Qué falta:** piezas sin precio visible ni nota, sin archivos de descarga, sin acabados, y fotos sin descripción. Cada línea lleva a la ficha.
- **Últimos cambios:** las ocho fichas modificadas más recientemente, con su foto y la fecha.
- **Ver el sitio:** enlace a la portada pública.

### Listas
- Miniatura de la foto principal en la primera columna (productos, proyectos y servicios).
- El estado de la pieza como etiqueta de color.
- Interruptor "Visible en el sitio" que se cambia desde la misma lista, sin abrir la ficha.
- Filtros de un clic sobre la tabla: todas, visibles, ocultas y, en piezas, cada estado.
- Acabados con su muestra de color o textura.

### Ficha (formulario)
- En la columna lateral, la tarjeta "Lista para publicar" con lo que falta, que se marca sola mientras se llena.
- "Ver en el sitio" en la misma columna. Los cambios se ven en el sitio al guardar.
- Pestañas con nombres simples, como ya están (Pieza, Fotos y acabados, Medidas y materiales, Precio y estado, Archivos).

### Menú
- Grupos por marca: **Kormós**, **Arpad y Aracena** (comparten proyectos), **Biblioteca** y **Ajustes**.
- El inicio del panel funciona como mapa: cada marca con sus accesos.

### Mensajes
- Confirmaciones en español claro: "Guardado. El sitio ya muestra el cambio."

## Fuera de esta fase
- **Vista previa en vivo dentro del panel.** Exige guardar borradores. Hoy "Ver en el sitio" muestra el cambio al guardar. Se puede añadir después si el cliente lo pide.
- **Prueba con el cliente.** Es una sesión con una persona real (la Fase 8 la deja lista). Ver la sección "Prueba con el cliente" en `GUIA-DEL-PANEL.md`.
