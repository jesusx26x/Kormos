# Guía de publicación del sitio

Para publicar el sitio de Aracena Studio, Arpad Studio y Kormós en internet, con su dominio propio, **sin haberlo hecho nunca**. Cada paso dice qué es, para qué sirve, qué hacer exactamente y cómo comprobar que quedó bien. Usted crea las cuentas y paga; si algo técnico no sale como dice la guía, pídale ayuda a Claude con la captura de pantalla.

Tiempo total: unas 2 a 3 horas, más la espera de la verificación del dominio (de minutos a un día).

---

## 0. Antes de empezar

### Qué vamos a montar

El sitio ya funciona en su computadora. Para que funcione en internet necesita cinco piezas:

| Pieza | Para qué | Servicio que usaremos |
|---|---|---|
| **Dominio** | La dirección que la gente escribe (por ejemplo, `arpadstudio.com`) | Vercel (o NIC.do si quieren un `.do`) |
| **Hosting** | La computadora en internet que muestra el sitio y el panel | Vercel |
| **Base de datos** | Donde se guardan las piezas, proyectos, textos y suscriptores | Neon (se crea desde Vercel) |
| **Almacenamiento** | Donde se guardan las fotos y los archivos .skp, .dwg y .pdf | Vercel Blob |
| **Correo** | Para los avisos a suscriptores y para recuperar contraseñas | Resend |

Se escogieron porque se manejan casi todo desde **un solo lugar (Vercel)**, se conectan con GitHub, donde ya está el código, y cada cambio que se guarde en GitHub se publica solo.

### Cuánto cuesta

Precios consultados el 19 de octubre de 2026. Confírmelos en la página de cada servicio antes de pagar.

| Servicio | Costo | Nota |
|---|---|---|
| Dominio `.com` | Unos US$12 al año | Un `.do` cuesta unos US$110 al año; un `.com.do`, menos (confirme en nic.do) |
| Vercel **Pro** | US$20 al mes | El plan gratis (Hobby) **no permite** sitios de negocios. Pro trae 5 GB para fotos y archivos |
| Neon (base de datos) | Gratis | Hasta 0.5 GB, de sobra para este sitio |
| Resend (correo) | Gratis | Hasta 3,000 correos al mes y **100 por día**. Con más de unos 90 suscriptores, el plan de US$20 al mes |

**Total para empezar:** unos US$20 al mes más el dominio.

> **Opción para ahorrar:** si Trinitaria Digital ya paga Vercel Pro (por ejemplo, para otros sitios), el proyecto se puede alojar en ese mismo equipo sin pagar otra cuota. Decida esto con John antes del paso 3: cambia a nombre de quién queda la cuenta.

### Decisión: a nombre de quién

Le recomiendo que **el dominio y las cuentas queden a nombre del dueño del negocio**, con un correo de la empresa, y que usted entre como colaborador. Si un día cambian de proveedor, el negocio no pierde su dominio.

### Qué necesita tener a mano

- [ ] Una tarjeta para pagar en dólares.
- [ ] Un correo de la empresa (no personal) para crear las cuentas.
- [ ] El celular, para la verificación en dos pasos.
- [ ] Un gestor de contraseñas (por ejemplo, el de Google o Bitwarden) para guardar todo lo que cree.
- [ ] Su computadora con el proyecto funcionando (`npm run dev`).

---

## 1. Pasar los últimos cambios a la rama principal de GitHub

**Qué es:** GitHub guarda el código. Vercel publica lo que está en la rama principal (`main`).

1. Pídale a Claude que abra el PR (la solicitud de cambios) de la rama `claude/brave-lovelace-trs7la` hacia `main`.
2. En GitHub, abra el PR y pulse **Merge pull request** y luego **Confirm merge**.

**Cómo comprobarlo:** en la página del repositorio, la rama `main` muestra los archivos `GUIA-DE-PUBLICACION.md` y `GUIA-DEL-PANEL.md`.

---

## 2. Escoger y comprar el dominio

**Qué es:** la dirección del sitio. Hay que escogerla con el cliente.

1. Con el cliente, escojan el nombre. Que sea corto, fácil de dictar por teléfono y sin guiones. Tengan dos o tres opciones por si la primera está ocupada.
2. **Si es `.com`** (recomendado): se compra en Vercel en el paso 8. Así no hay que configurar nada más. Por ahora, solo compruebe que está libre en [vercel.com/domains](https://vercel.com/domains).
3. **Si es `.do` o `.com.do`:** se compra en [nic.do](https://nic.do) con los datos del negocio. Guarde el usuario y la contraseña del panel de NIC.do: los necesitará en el paso 8.

**Cómo comprobarlo:** tiene el nombre escogido y confirmado como libre (o comprado, si es `.do`).

---

## 3. Crear la cuenta de Vercel

**Qué es:** Vercel es el hosting: muestra el sitio y el panel.

1. Entre a [vercel.com/signup](https://vercel.com/signup) y pulse **Continue with GitHub**. Use la cuenta de GitHub que tiene acceso al repositorio.
2. Cuando pregunte el tipo de uso, escoja el uso comercial (plan **Pro**) y ponga la tarjeta.
3. En **Settings → Security**, active la verificación en dos pasos.

**Cómo comprobarlo:** arriba a la izquierda aparece el nombre de su equipo con la etiqueta **Pro**.

---

## 4. Crear el proyecto en Vercel

1. Pulse **Add New… → Project**.
2. En la lista de repositorios, busque **Kormos** y pulse **Import**. Si no aparece, pulse **Adjust GitHub App Permissions** y dele acceso a ese repositorio.
3. En la pantalla de configuración:
   - **Root Directory:** pulse **Edit** y escoja la carpeta **`web`**. Es lo más importante de este paso.
   - **Framework Preset:** debe decir **Next.js** (lo detecta solo).
   - Abra **Environment Variables** y agregue estas dos:

     | Name | Value |
     |---|---|
     | `PAYLOAD_SECRET` | Una clave larga al azar. Pídasela a Claude o genérela en su computadora con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. **Guárdela en el gestor de contraseñas.** |
     | `NEXT_PUBLIC_SITE_URL` | La dirección final con `https://` y sin `/` al final, por ejemplo `https://arpadstudio.com` |

4. Pulse **Deploy**. **Este primer intento va a fallar**, porque todavía no hay base de datos. Es normal: siga al paso 5.

---

## 5. Crear la base de datos y el almacenamiento

### Base de datos (Neon)

1. Dentro del proyecto, vaya a la pestaña **Storage**.
2. Pulse **Create Database**, escoja **Neon** (Serverless Postgres) y el plan **Free**.
3. Región: la más cercana a República Dominicana que ofrezca (por ejemplo, **US East**).
4. Al terminar, pulse **Connect Project** y escoja este proyecto, en todos los entornos (Production, Preview y Development).

### Almacenamiento de fotos y archivos (Vercel Blob)

1. En la misma pestaña **Storage**, pulse **Create** y escoja **Blob**.
2. Nombre: `kormos-archivos`. Acceso: **Public** (las fotos y los archivos de descarga son públicos).
3. Conéctelo al proyecto, igual que la base de datos.

**Cómo comprobarlo:** en **Settings → Environment Variables** aparecen, además de las dos suyas, `DATABASE_URL` (y otras de Neon) y `BLOB_READ_WRITE_TOKEN`.

---

## 6. Primer despliegue

1. Vaya a la pestaña **Deployments**, abra el último (el que falló) y pulse **⋯ → Redeploy**.
2. Espere unos 3 a 5 minutos. Durante la compilación, el sistema crea solo las tablas de la base de datos.

**Cómo comprobarlo:** el despliegue dice **Ready**, en verde. Pulse **Visit**: se abre el sitio en una dirección del tipo `kormos-xxxx.vercel.app`. Se ve el diseño, pero **sin piezas ni proyectos**: el contenido llega en el paso 7.

### Crear su usuario del panel (hágalo ya)

> Mientras no exista ningún usuario, cualquiera que entre a `/admin` podría crear el primero. Hágalo en cuanto termine el despliegue.

1. Abra la dirección `.vercel.app` y añada `/admin` al final.
2. Aparece **Crear el primer usuario**. Use el correo de la empresa y una contraseña larga (guárdela en el gestor).

**Cómo comprobarlo:** entra al inicio del panel, con las tres marcas.

---

## 7. Pasar el contenido de su computadora al sitio publicado

**Qué es:** copiar las piezas, proyectos, fotos, archivos, textos y suscriptores que tiene en el panel de su computadora. Las relaciones (qué fotos tiene cada pieza, qué acabados, etc.) se conservan.

1. En Vercel: **Settings → Environment Variables**. Copie el valor de estas variables (pulse el ojo para verlo): `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN` y `PAYLOAD_SECRET`.
2. En su computadora, dentro de la carpeta `web`, cree un archivo llamado **`.env.nube`** con este contenido (cambie cada valor por el que copió):

   ```
   DATABASE_URL=postgres://…
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_…
   PAYLOAD_SECRET=…
   NEXT_PUBLIC_SITE_URL=https://arpadstudio.com
   ```

   Este archivo tiene las llaves del sitio publicado: **no lo comparta ni lo suba a GitHub**. El proyecto ya está configurado para no subirlo.
3. Abra una terminal en la carpeta `web` y ejecute, uno después del otro:

   ```
   npm run contenido:exportar
   npm run contenido:importar
   ```

   El primero junta todo en la carpeta `web/exportacion`. El segundo lo sube al sitio publicado (tarda unos minutos por las fotos). Al final dice **Listo**.
4. En Vercel, **Deployments → ⋯ → Redeploy**, para que el sitio se vuelva a armar con el contenido.

**Cómo comprobarlo:** en la dirección `.vercel.app`, el catálogo de Kormós muestra las piezas con sus fotos, y los proyectos de Arpad y Aracena aparecen.

> **Si el contenido todavía es de muestra:** se puede pasar igual y cambiarlo después desde el panel publicado (Fase 10). Lo que se cargue en el panel publicado ya no hay que pasarlo.

---

## 8. Conectar el dominio

### Si compró (o va a comprar) el dominio en Vercel

1. En el proyecto: **Settings → Domains → Add**.
2. Escriba el dominio. Si no lo ha comprado, Vercel ofrece comprarlo ahí mismo.
3. Agregue también la versión con `www` y escoja que **redirija** a la versión sin `www`.

### Si lo compró en NIC.do

1. En el proyecto: **Settings → Domains → Add** y escriba el dominio.
2. Vercel le muestra uno o dos **registros DNS** (un tipo **A** con una dirección numérica y un **CNAME** para `www`). **Use exactamente los que muestre Vercel**: no los copie de otro lugar.
3. Entre al panel de NIC.do, busque la configuración de **DNS** (o "zona") del dominio y agregue esos registros tal cual.
4. Espere: puede tardar de unos minutos a un día.

**Cómo comprobarlo:** en **Settings → Domains**, el dominio aparece con una marca verde (**Valid Configuration**). Al abrir `https://sudominio.com` se ve el sitio con el candado del navegador.

Si el dominio final es distinto del que puso en `NEXT_PUBLIC_SITE_URL`, cámbielo en **Settings → Environment Variables** y haga **Redeploy**.

---

## 9. Correo: avisos a suscriptores y recuperar contraseñas

**Qué es:** Resend envía los correos con el nombre del dominio (por ejemplo, `novedades@arpadstudio.com`).

1. Cree la cuenta en [resend.com](https://resend.com) con el correo de la empresa y active la verificación en dos pasos.
2. **Domains → Add Domain**, escriba el dominio y escoja la región **US East**.
3. Resend le muestra varios **registros DNS** (para que los correos no lleguen a spam). Agréguelos:
   - Si el dominio está en Vercel: **Vercel → su equipo → Domains → el dominio → DNS Records → Add**, uno por uno, copiando el tipo, el nombre y el valor exactos.
   - Si está en NIC.do: en el panel de DNS de NIC.do, igual.
4. Vuelva a Resend y pulse **Verify**. Puede tardar unos minutos.
5. **API Keys → Create API Key**, con permiso **Sending access**. Copie la clave (empieza por `re_`): **solo se muestra una vez**.
6. En Vercel, **Settings → Environment Variables**, agregue:

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | La clave `re_…` |
   | `EMAIL_FROM` | `novedades@sudominio.com` |
   | `EMAIL_FROM_NAME` | `Aracena Studio · Arpad Studio · Kormós` |

7. **Deployments → ⋯ → Redeploy**.

**Cómo comprobarlo:**
1. Suscríbase usted mismo desde el pie del sitio publicado.
2. En el panel, abra una pieza y pulse **Avisar ahora**. Le debe llegar el correo con la foto y el enlace.
3. Pruebe el enlace **Darme de baja** del correo.

> **Ojo con el límite gratis:** 100 correos por día. Si hay más de unos 90 suscriptores, suba Resend al plan de pago antes de avisar.

---

## 10. Revisión final antes de anunciarlo

Abra el sitio en el celular **y** en la computadora y revise:

- [ ] La portada con las tres marcas, y cada marca.
- [ ] Un botón de WhatsApp de cada marca: abre el chat con el mensaje escrito.
- [ ] Una pieza de Kormós: fotos, cambio de acabado, "Mi selección" y "Solicitar cotización".
- [ ] Una descarga (.skp, .dwg o .pdf), si ya hay archivos.
- [ ] Pegue el enlace de una pieza en un chat de WhatsApp: aparece la vista previa con la foto.
- [ ] En el panel, suba una foto de prueba, úsela en una pieza oculta y bórrela después.
- [ ] En el panel, oculte una pieza y compruebe que desaparece del sitio. Vuelva a mostrarla.
- [ ] Suscripción y baja (paso 9).
- [ ] Las fotos y textos de muestra se cambiaron por los originales, o el cliente aceptó salir con ellos. Confirme que tienen permiso para usar cada foto (ver `ADN-DE-MARCA.md`, sección 6).

---

## 11. Después de publicar

### Cómo se actualiza el sitio
- **Contenido** (piezas, proyectos, textos, fotos): desde el panel, `sudominio.com/admin`. Se ve en el sitio al guardar.
- **Diseño o funciones**: cada cambio que llegue a la rama `main` de GitHub se publica solo en unos minutos. Si el cambio toca los campos del panel, quien programa debe incluir la migración (`npm run migrate:create`); Vercel la aplica sola al publicar.

### Copias de seguridad
- Una vez al mes, en su computadora (con el archivo `.env.nube` del paso 7), ejecute `npm run contenido:respaldo`. Guarda todo el contenido y los archivos del sitio publicado en `web/exportacion`. Copie esa carpeta a un disco o a Google Drive con la fecha en el nombre.
- Neon guarda además un historial corto de la base de datos.

### Qué vigilar
- **Vercel → Usage:** que el almacenamiento de fotos y archivos no pase de los 5 GB incluidos. Los modelos .skp pesan mucho.
- **Resend → Usage:** los correos del mes.
- **Renovación del dominio:** active la renovación automática.

### Si algo sale mal

| Qué pasa | Qué hacer |
|---|---|
| El despliegue falla (rojo en Deployments) | Abra el despliegue, copie las últimas líneas del registro (**Build Logs**) y páselas a Claude |
| El sitio no muestra un cambio del panel | Recargue la página. Si sigue igual, haga **Redeploy** |
| No llegan los correos | Revise en Resend que el dominio esté **Verified** y que las tres variables del paso 9 estén en Vercel |
| El dominio no carga | **Settings → Domains**: si no está en verde, revise los registros DNS del paso 8 |
| Olvidó la contraseña del panel | Use **¿Olvidaste tu contraseña?** en la entrada (funciona desde el paso 9) |

---

Fuentes de precios (consultadas el 19-oct-2026): [Vercel, precios 2026 (makerkit)](https://makerkit.dev/blog/saas/vercel-cost), [Vercel Blob: uso y precios](https://examples.vercel.com/docs/vercel-blob/usage-and-pricing), [Neon: precios](https://neon.com/pricing), [Resend: plan gratis](https://automationatlas.io/answers/resend-free-tier-explained-2026/), [Dominio .do (EuroDNS)](https://www.eurodns.com/es/dominios/dominio-do).
