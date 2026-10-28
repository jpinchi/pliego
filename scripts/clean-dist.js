// Vacía dist/ antes de compilar para que solo exista la versión que se está generando.
// Las versiones anteriores quedan en GitHub Releases.
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "..", "dist");
try {
  fs.rmSync(dist, { recursive: true, force: true });
  console.log("✓ dist/ vaciado");
} catch (e) {
  console.error(`✗ No se pudo vaciar dist/ (${e.code}). ¿Hay un Pliego abierto desde dist\\win-unpacked? Ciérralo y vuelve a intentarlo.`);
  process.exit(1);
}
