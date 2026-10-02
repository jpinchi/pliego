// Script para generar capturas del README.
// Uso: node docs/screenshots/capture.mjs
import { _electron as electron } from 'playwright-core';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR   = path.resolve(__dirname, '../..');
const SHOT_DIR  = __dirname;

const electronBin = path.join(
  APP_DIR, 'node_modules', 'electron', 'dist',
  process.platform === 'win32' ? 'electron.exe' : 'electron'
);

const wait = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, name) {
  const file = path.join(SHOT_DIR, name);
  await page.screenshot({ path: file });
  const stats = fs.statSync(file);
  console.log(`✓ ${name}  (${Math.round(stats.size/1024)} KB)`);
}

// PDF de demostración con texto visible (generado offline, sin dependencias)
const DEMO_PDF_B64 =
  'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwg' +
  'L1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2Ug' +
  'L1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAv' +
  'Rm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA5NCA+PgpzdHJlYW0KQlQK' +
  'L0YxIDI4IFRmCjcyIDcyMCBUZAooUGxpZWdvIC0gRWRpdG9yIGRlIFBERikgVGoKMCAtNDAgVEQKL0YxIDE2IFRmCihE' +
  'b2N1bWVudG8gZGUgZGVtb3N0cmFjafNuKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL1R5cGUgL0Zv' +
  'bnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAw' +
  'IDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4g' +
  'CjAwMDAwMDAyNjYgMDAwMDAgbiAKMDAwMDAwMDQxMiAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAw' +
  'IFIgPj4Kc3RhcnR4cmVmCjQ5NAolJUVPRg==';

(async () => {
  console.log('Lanzando Pliego…');
  const app = await electron.launch({
    executablePath: electronBin,
    args: [APP_DIR],
    timeout: 30_000,
  });

  const page = await app.firstWindow();
  await page.waitForLoadState('domcontentloaded');
  await wait(3000);

  // Limpiar archivos recientes para no mostrar datos reales
  await page.evaluate(() => {
    try { localStorage.removeItem('pliego_recent_files'); } catch(_) {}
  });
  await wait(300);

  // Recargar para que el cambio de localStorage surta efecto
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await wait(2500);

  // ── 1. Pantalla principal — tema oscuro, sin PDF ──────────────────────
  // Forzar tema oscuro explícitamente
  await page.evaluate(() => document.body.classList.remove('theme-light'));
  await wait(300);
  await shot(page, 'main-dark.png');

  // ── 2. Con PDF cargado — mostrar el visor ───────────────────────────
  const loaded = await page.evaluate(async (b64) => {
    try {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      // Buscar la función de carga interna del renderer
      const fns = ['loadPdfFromBytes','openPdfBytes','loadBytes','handleFiles'];
      for (const fn of fns) {
        if (typeof window[fn] === 'function') {
          await window[fn](bytes, 'demo-pliego.pdf');
          return fn;
        }
      }
      // Si no hay función pública, disparar el evento de drop programáticamente
      // creando un File y disparando el evento drag-drop en el drop zone
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const file = new File([blob], 'demo-pliego.pdf', { type: 'application/pdf' });
      const dt = new DataTransfer();
      dt.items.add(file);
      const dropZone = document.querySelector('.drop-zone, #dropZone, .canvas-area, #canvasArea, body');
      if (dropZone) {
        const ev = new DragEvent('drop', { dataTransfer: dt, bubbles: true });
        dropZone.dispatchEvent(ev);
        return 'drop-event';
      }
      return 'no-handler';
    } catch(e) { return 'error:' + e.message; }
  }, DEMO_PDF_B64);
  console.log('  PDF load result:', loaded);
  await wait(2500);
  await shot(page, 'annotations.png');

  // ── 3. Panel de firma ────────────────────────────────────────────────
  const clicked = await page.evaluate(() => {
    // Buscar botón de Sign por data-id, title o texto
    const btns = [...document.querySelectorAll('button, [data-id], .tool-btn, .rail-btn')];
    const signBtn = btns.find(b =>
      b.getAttribute('data-id') === 'sign' ||
      (b.title || '').toLowerCase().includes('sign') ||
      (b.title || '').toLowerCase().includes('firma') ||
      b.textContent?.trim() === 'Sign'
    );
    if (signBtn) { signBtn.click(); return true; }
    return false;
  });
  console.log('  Sign btn clicked:', clicked);
  await wait(1200);
  await shot(page, 'signature.png');

  // ── 4. Tema claro — cerrar cualquier modal abierto primero ──────────
  await page.keyboard.press('Escape');
  await wait(400);
  // Cerrar modal via botón Cancel si sigue abierto
  await page.evaluate(() => {
    const cancel = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Cancel');
    if (cancel) cancel.click();
  });
  await wait(400);
  await page.evaluate(() => document.body.classList.add('theme-light'));
  await wait(500);
  await shot(page, 'main-light.png');

  await app.close();
  console.log('\nCapturas listas en docs/screenshots/');
})().catch(e => { console.error(e); process.exit(1); });
