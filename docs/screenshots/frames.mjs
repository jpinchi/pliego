import { _electron as electron } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, '../..');
const electronBin = path.join(APP_DIR, 'node_modules', 'electron', 'dist', 'electron.exe');
const OUT = __dirname;

(async () => {
  const app = await electron.launch({
    executablePath: electronBin,
    args: [APP_DIR],
    timeout: 30_000,
  });

  async function shot(tag) {
    const wins = app.windows();
    for (let i = 0; i < wins.length; i++) {
      try {
        const f = path.join(OUT, `${tag}-w${i}.png`);
        await wins[i].screenshot({ path: f });
        console.log(`${tag}-w${i}: ${wins[i].url()}`);
      } catch(e) { console.log(`${tag}-w${i}: ERR ${e.message}`); }
    }
  }

  await shot('f0');
  await new Promise(r => setTimeout(r, 150)); await shot('f150');
  await new Promise(r => setTimeout(r, 250)); await shot('f400');
  await new Promise(r => setTimeout(r, 400)); await shot('f800');
  await new Promise(r => setTimeout(r, 500)); await shot('f1300');

  await app.close();
})().catch(e => { console.error(e.message); process.exit(1); });
