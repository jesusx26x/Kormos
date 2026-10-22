# Reels

Videos para redes hechos con [Remotion](https://www.remotion.dev): reels verticales de 1080 × 1920 a 30 fotogramas por segundo.

## Kormós: reel de lanzamiento (35 s)

- Composición `KormosReel` (`src/kormos/KormosReel.tsx`) y portada `KormosCover`.
- Las tomas de la web salen de capturas reales del sitio en tamaño de iPhone, guardadas en `public/captures/` (no van al repositorio por su peso). Para regenerarlas, con el sitio corriendo en local:

```bash
SITE=http://localhost:3300 CHROME_PATH=/ruta/a/chromium node scripts/capturar.cjs
```

- Vista previa: `npm run dev`.
- Video final, sin audio (la música se pone al publicar en cada red):

```bash
npx remotion render KormosReel out/kormos-reel.mp4 --codec=h264 --crf=16 --muted
npx remotion still KormosCover out/kormos-reel-portada.png
```
