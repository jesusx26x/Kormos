// Captura el sitio en tamaño de iPhone (390 × 844 a 3x) para el reel de Kormós.
// Uso: SITE=http://localhost:3300 CHROME_PATH=/ruta/a/chromium node scripts/capturar.cjs
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('fs');
const BASE = process.env.SITE || 'http://localhost:3300';
const OUT = require('path').resolve(__dirname, '../public/captures');
const NO_ANIM = '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}';
const meta = {};
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce', locale: 'es-DO' });
  const p = await ctx.newPage();
  const go = async (path) => { await p.goto(BASE + path, { waitUntil: 'networkidle', timeout: 120000 }); await p.addStyleTag({ content: NO_ANIM }); await p.waitForTimeout(2500); };
  // Recorre la página para que carguen las fotos diferidas y aparezcan los bloques animados
  const warm = async () => {
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 400) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(250); }
    await p.evaluate(async () => { await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))); });
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1200);
  };
  const shot = async (name, opts = {}) => { if (opts.fullPage) await warm(); await p.screenshot({ path: `${OUT}/${name}.png`, ...opts }); console.log('ok', name); };
  const box = async (loc) => { const r = await loc.boundingBox(); const y = await p.evaluate(() => window.scrollY); return r && { x: r.x, y: r.y, w: r.width, h: r.height, scrollY: y }; };
  const top = (sel) => p.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY, sel);

  await go('/kormos');
  await shot('home_view');
  await shot('home_full', { fullPage: true });
  meta.home = { promoTop: await top('#promocion'), coleccionTop: await top('#coleccion'), height: await p.evaluate(() => document.documentElement.scrollHeight) };

  await p.evaluate(() => document.querySelector('#promocion').scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(800);
  await shot('promo_view');
  const input = p.locator('#promocion input[type=email]');
  meta.promo = { input: await box(input), button: await box(p.locator('#promocion button[type=submit]')) };
  await input.fill('tucorreo@gmail.com');
  await shot('promo_typed');

  await go('/kormos/catalogo');
  await shot('catalog_view');
  await shot('catalog_full', { fullPage: true });
  meta.catalog = { height: await p.evaluate(() => document.documentElement.scrollHeight) };
  const card = p.locator('a[href="/kormos/catalogo/mesa-de-noche-alma"]').first();
  await card.scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  meta.catalog.alma = { top: await p.evaluate(() => { const a = document.querySelector('a[href="/kormos/catalogo/mesa-de-noche-alma"]'); const r = a.getBoundingClientRect(); return { y: r.top + window.scrollY, x: r.left, w: r.width, h: r.height }; }) };

  await go('/kormos/catalogo/mesa-de-noche-alma');
  await shot('product_view');
  await shot('product_full', { fullPage: true });
  const sw = p.locator('label[class*="swatch"]');
  meta.product = { swatches: await sw.count() };
  await sw.nth(2).scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  meta.product.swatch = await box(sw.nth(2));
  await shot('product_swatch_before');
  await sw.nth(2).click();
  await p.waitForTimeout(800);
  await shot('product_swatch_after');
  const add = p.getByRole('button', { name: /Agregar a mi selección/ }).first();
  await add.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  meta.product.add = await box(add);
  await shot('product_add_before');
  await add.click();
  await p.waitForTimeout(1500);
  await shot('product_added');
  // Mi selección abierta, con el botón de cotizar
  await p.getByRole('button', { name: /Ver mi selección/ }).first().click();
  await p.waitForTimeout(1500);
  await shot('drawer');
  fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
  await b.close();
})().catch((e) => { console.error('ERR', e); process.exit(1); });
