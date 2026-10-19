// Lanza la CLI de Payload con tsx cargado desde el arranque de Node.
// El lanzador oficial (npx payload) falla en Node 24 al cargar undici dos veces.
// Uso: node --import tsx/esm scripts/payload-cli.mjs <comando>
const { bin } = await import("../node_modules/payload/dist/bin/index.js");
await bin();
