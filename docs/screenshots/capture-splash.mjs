// Captura solo el splash screen para verificar el diseño.
import { _electron as electron } from 'playwright-core';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR   = path.resolve(__dirname, '../..');
const electronBin = path.join(APP_DIR, 'node_modules', 'electron', 'dist', 'electron.exe');

(async () => {
  console.log('Lanzando Pliego con splash…');
  const app = await electron.launch({
    executablePath: electronBin,
    args: [APP_DIR],
    timeout: 30_000,
  });

  // Capturar la primera ventana que aparezca (debería ser el splash)
  const firstWin = await app.firstWindow();
  const url = firstWin.url();
  console.log('Primera ventana:', url);

  // Tomar screenshot inmediatamente
  const file = path.join(__dirname, 'splash-screen.png');
  await firstWin.screenshot({ path: file });
  console.log('✓ splash-screen.png');
  console.log('  Tamaño:', Math.round(fs.statSync(file).size / 1024), 'KB');

  // También esperar la segunda ventana (main) y capturarla
  await new Promise(r => setTimeout(r, 800));
  const windows = app.windows();
  console.log('Total ventanas después de 800ms:', windows.length);
  for (const w of windows) console.log(' -', w.url());

  await app.close();
})().catch(e => { console.error(e); process.exit(1); });
