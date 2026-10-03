// Genera las capturas del README abriendo Pliego (Electron) con un PDF de demostración.
// Uso: npm install && node docs/screenshots/capture.mjs
//
// - Usa un perfil temporal: no toca la configuración, firmas guardadas, archivos
//   recientes ni el tamaño de ventana de tu Pliego instalado.
// - El PDF y los nombres son inventados; ninguna captura muestra datos reales.
// - Las anotaciones se hacen con el mouse sobre las herramientas reales de la app.
import { _electron as electron } from 'playwright-core';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR   = path.resolve(__dirname, '../..');
const SHOT_DIR  = __dirname;
const W = 1600, H = 1000;

const electronBin = path.join(
  APP_DIR, 'node_modules', 'electron', 'dist',
  process.platform === 'win32' ? 'electron.exe' : 'electron'
);

const wait = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, name) {
  const file = path.join(SHOT_DIR, name);
  await page.mouse.move(4, H - 4);   // sin hover sobre ningún botón
  await wait(250);
  await page.screenshot({ path: file, scale: 'css' });
  console.log(`✓ ${name}  (${Math.round(fs.statSync(file).size / 1024)} KB)`);
}

// Crea un PDF de demostración con el pdf-lib que ya trae Pliego y lo abre con
// ingestFiles(), la misma función que usan "Abrir" y el arrastrar-y-soltar.
async function openDemoPdf(page) {
  await page.evaluate(async () => {
    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
    const doc = await PDFDocument.create();
    doc.setTitle('Propuesta de servicios');
    const pg = doc.addPage([612, 792]);
    const f  = await doc.embedFont(StandardFonts.Helvetica);
    const fb = await doc.embedFont(StandardFonts.HelveticaBold);
    const ink = rgb(0.12, 0.14, 0.2), mute = rgb(0.42, 0.45, 0.52), brand = rgb(0.94, 0.63, 0.13);
    const T = (s, x, y, size = 11, font = f, color = ink) => pg.drawText(s, { x, y, size, font, color });

    pg.drawRectangle({ x: 0, y: 742, width: 612, height: 50, color: rgb(0.1, 0.12, 0.17) });
    pg.drawRectangle({ x: 0, y: 738, width: 612, height: 4, color: brand });
    T('ESTUDIO NORTE', 56, 760, 16, fb, rgb(1, 1, 1));
    T('Diseño y desarrollo de software', 400, 762, 10, f, rgb(0.8, 0.82, 0.86));

    T('Propuesta de servicios', 56, 690, 26, fb);
    T('Propuesta N.º 2026-014  ·  2 de octubre de 2026', 56, 668, 11, f, mute);
    T('PARA', 56, 630, 9, fb, mute);      T('Cliente de ejemplo S.A.', 56, 615, 12, fb);
    T('Av. Principal 123, Oficina 4', 56, 600, 10, f, mute);
    T('VIGENCIA', 330, 630, 9, fb, mute); T('30 días', 330, 615, 12, fb);

    [
      'Gracias por considerarnos. Esta propuesta describe el alcance, los plazos y la',
      'inversión para desarrollar una aplicación de escritorio a la medida, con panel',
      'de control, reportes en PDF y soporte técnico durante los primeros tres meses.',
    ].forEach((l, i) => T(l, 56, 565 - i * 17, 11));

    let y = 485;
    pg.drawRectangle({ x: 56, y: y - 6, width: 500, height: 24, color: rgb(0.93, 0.94, 0.96) });
    T('CONCEPTO', 66, y + 2, 9, fb, mute); T('HORAS', 380, y + 2, 9, fb, mute); T('IMPORTE', 480, y + 2, 9, fb, mute);
    const rows = [
      ['Diseño de interfaz y prototipo', '40', '$1,600'],
      ['Desarrollo de la aplicación', '120', '$4,800'],
      ['Reportes PDF y exportación', '24', '$960'],
      ['Pruebas, instalador y entrega', '16', '$640'],
    ];
    rows.forEach((r, i) => {
      const ry = y - 32 - i * 28;
      T(r[0], 66, ry, 11); T(r[1], 388, ry, 11); T(r[2], 480, ry, 11);
      pg.drawLine({ start: { x: 56, y: ry - 10 }, end: { x: 556, y: ry - 10 }, thickness: 0.6, color: rgb(0.86, 0.87, 0.9) });
    });
    y = y - 32 - rows.length * 28;
    T('TOTAL', 380, y - 4, 11, fb); T('$8,000', 474, y - 4, 15, fb);

    T('Condiciones', 56, 280, 13, fb);
    ['50% al aprobar la propuesta y 50% contra entrega.',
     'Incluye 3 meses de soporte y actualizaciones sin costo.',
     'Entrega estimada: 6 semanas a partir de la aprobación.'].forEach((l, i) => {
      pg.drawCircle({ x: 62, y: 258 - i * 18 + 3.5, size: 2.2, color: brand });
      T(l, 72, 258 - i * 18, 11);
    });

    pg.drawLine({ start: { x: 56, y: 120 },  end: { x: 266, y: 120 }, thickness: 0.8, color: mute });
    pg.drawLine({ start: { x: 346, y: 120 }, end: { x: 556, y: 120 }, thickness: 0.8, color: mute });
    T('Estudio Norte', 56, 104, 10, fb);           T('Firma del proveedor', 56, 90, 9, f, mute);
    T('Cliente de ejemplo S.A.', 346, 104, 10, fb); T('Firma del cliente', 346, 90, 9, f, mute);

    const file = new File([await doc.save()], 'Propuesta-de-servicios.pdf', { type: 'application/pdf' });
    reset();
    await ingestFiles([file], true);
  });
  await page.waitForFunction(() => pages.length > 0);
  await wait(1200);
}

// Zoom: "ajustar" deja la página completa a la vista; un número fija el zoom (1.25 = 125%).
async function setZoom(page, target) {
  if (target === 'page') {
    for (let i = 0; i < 10; i++) {
      const fits = await page.evaluate(() =>
        $('#overlay').getBoundingClientRect().height <= $('#viewer').clientHeight - 40);
      if (fits) break;
      await page.click('#zoomOut'); await wait(500);
    }
  } else {
    await page.evaluate(async (z) => { zoom = z; await renderMain(); }, target);
    await wait(500);
  }
  await page.evaluate(() => { $('#viewer').scrollTop = 0; });
  await wait(300);
}

async function annotate(page) {
  const box = await page.evaluate(() => {
    const r = $('#overlay').getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  // Coordenadas del PDF (puntos, origen abajo-izquierda) -> píxeles en pantalla
  const P = (px, py) => [box.x + (px / 612) * box.w, box.y + ((792 - py) / 792) * box.h];
  const tool  = async (id) => { await page.click(`button.tool[data-tool-id="${id}"]`); await wait(200); };
  const color = async (c)  => { await page.click(`.swatch[data-c="${c}"]`); await wait(100); };
  const drag  = async (pts, steps = 6) => {
    await page.mouse.move(...P(...pts[0]));
    await page.mouse.down();
    for (const pt of pts.slice(1)) await page.mouse.move(...P(...pt), { steps });
    await page.mouse.up();
    await wait(200);
  };

  // Resaltado
  await tool('highlight'); await color('#f0a020');
  await drag([[205, 559], [379, 545]], 10);

  // Óvalo alrededor del total
  await tool('shapes');
  await page.evaluate(() => { shapeKind = 'ellipse'; });
  await color('#e2574c');
  await drag([[364, 362], [566, 320]], 12);

  // Palomitas a mano junto a cada condición
  await tool('draw'); await color('#46c08a');
  for (const y of [262, 244, 226]) await drag([[392, y], [397, y - 5], [410, y + 9]], 5);

  // Nota de texto
  await tool('text'); await color('#e2574c');
  await page.mouse.click(...P(214, 356));
  await page.fill('#txtInput', '¡Aprobado!');
  await page.fill('#txtSize', '22');
  await page.click('#txtOk');
  await wait(250);

  // Firma escrita del cliente
  await tool('sign');
  await page.fill('#sigTypeInput', 'Laura Méndez');
  await page.dispatchEvent('#sigTypeInput', 'input');
  await wait(300);
  await page.uncheck('#sigSaveCheck');
  await page.click('#sigUse');
  await wait(300);
  await page.mouse.click(...P(372, 152));
  await wait(600);

  await tool('select');
}

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'pliego-capture-'));
  console.log('Lanzando Pliego…');
  const app = await electron.launch({
    executablePath: electronBin,
    args: [`--user-data-dir=${profile}`, APP_DIR],
    timeout: 30_000,
  });

  try {
    const userData = await app.evaluate(({ app }) => app.getPath('userData'));
    if (!path.resolve(userData).startsWith(path.resolve(profile))) {
      throw new Error(`Perfil no aislado (${userData}); se cancela para no tocar tu configuración.`);
    }

    const page = await app.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await app.evaluate(({ BrowserWindow }, [w, h]) => {
      const win = BrowserWindow.getAllWindows()[0];
      win.unmaximize(); win.setContentSize(w, h); win.center();
    }, [W, H]);

    // Preferencias limpias: español, tema oscuro y sin el tour de bienvenida
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('pliego_lang', 'es');
      localStorage.setItem('pliego_theme', 'dark');
      localStorage.setItem('pliego_tour_seen', '1');
      localStorage.setItem('pliego_auto_tour', '0');
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await wait(1500);
    await page.addStyleTag({ content: '.toast{visibility:hidden!important}' });

    await openDemoPdf(page);
    await setZoom(page, 'page');
    await annotate(page);

    // 1. Pantalla principal: documento completo anotado y firmado
    await shot(page, 'main-dark.png');

    // 2. Anotaciones de cerca, con la herramienta Resaltar y su panel de colores
    await page.click('button.tool[data-tool-id="highlight"]');
    await setZoom(page, 1.25);
    await shot(page, 'annotations.png');

    // 3. Panel de firma abierto, con un nombre escrito y los estilos de letra
    await page.click('button.tool[data-tool-id="select"]');
    await setZoom(page, 'page');
    await page.click('button.tool[data-tool-id="sign"]');
    await page.fill('#sigTypeInput', 'Laura Méndez');
    await page.dispatchEvent('#sigTypeInput', 'input');
    await wait(500);
    await shot(page, 'signature.png');
    await page.click('#sigCancel');
    await wait(300);

    // 4. Tema claro
    await page.click('button.tool[data-tool-id="select"]');
    await page.evaluate(() => applyTheme('light'));
    await wait(500);
    await shot(page, 'main-light.png');
  } finally {
    await app.close();
    fs.rmSync(profile, { recursive: true, force: true });
  }
  console.log('\nCapturas listas en docs/screenshots/');
})().catch(e => { console.error(e); process.exit(1); });
