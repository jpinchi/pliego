// Genera build/icon.ico multi-resolución de alta calidad a partir de build/icon.png.
// Cada tamaño se redimensiona individualmente (no se escala uno solo), para que
// el ícono se vea nítido en escritorio, taskbar, accesos directos y el explorador.
const sharp = require("sharp");
const pngToIco = require("png-to-ico").default;
const os = require("os");
const fs = require("fs");
const path = require("path");

const SIZES = [16, 24, 32, 48, 64, 128, 256];
const SRC = path.join(__dirname, "icon.png");
const OUT = path.join(__dirname, "icon.ico");

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pliego-icon-"));
  const tmpFiles = await Promise.all(
    SIZES.map(async size => {
      const file = path.join(tmpDir, `${size}.png`);
      await sharp(SRC).resize(size, size, { kernel: "lanczos3" }).png().toFile(file);
      return file;
    })
  );
  const ico = await pngToIco(tmpFiles);
  fs.writeFileSync(OUT, ico);
  fs.rmSync(tmpDir, { recursive: true, force: true });
  console.log("icon.ico generado con tamaños:", SIZES.join(", "));
}

main().catch(e => { console.error(e); process.exit(1); });
