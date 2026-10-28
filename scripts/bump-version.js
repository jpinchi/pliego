#!/usr/bin/env node
/**
 * Incrementa la versión semántica en package.json, package-lock.json, README.md y CHANGELOG.md.
 * Uso: node scripts/bump-version.js [patch|minor|major]
 */
const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const pkgPath = path.join(root, "package.json");
const clPath  = path.join(root, "CHANGELOG.md");

const type = process.argv[2] || "patch";
if (!["patch","minor","major"].includes(type)) {
  console.error("Tipo inválido. Usa: patch | minor | major");
  process.exit(1);
}

// Leer versión actual
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const [maj, min, pat] = pkg.version.split(".").map(Number);

let newVersion;
if      (type === "major") newVersion = `${maj+1}.0.0`;
else if (type === "minor") newVersion = `${maj}.${min+1}.0`;
else                       newVersion = `${maj}.${min}.${pat+1}`;

// Actualizar package.json y package-lock.json
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`✓ package.json → v${newVersion}`);

const lockPath = path.join(root, "package-lock.json");
if (fs.existsSync(lockPath)) {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  lock.version = newVersion;
  if (lock.packages && lock.packages[""]) lock.packages[""].version = newVersion;
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n");
  console.log(`✓ package-lock.json → v${newVersion}`);
}

// README: enlaces de descarga, nombres de archivo y "Versión actual" apuntan a la versión vigente
const readmePath = path.join(root, "README.md");
const oldVersion = `${maj}.${min}.${pat}`;
if (fs.existsSync(readmePath)) {
  const exact = new RegExp(`(?<![\\d.])${oldVersion.replace(/\./g, "\\.")}(?!\\.?\\d)`, "g");
  const readme = fs.readFileSync(readmePath, "utf8");
  const count = (readme.match(exact) || []).length;
  fs.writeFileSync(readmePath, readme.replace(exact, newVersion));
  console.log(`✓ README.md — ${count} referencias v${oldVersion} → v${newVersion}`);
}

// Leer CHANGELOG
const today = new Date().toISOString().slice(0, 10);
let cl = "";
try { cl = fs.readFileSync(clPath, "utf8"); } catch (_) {}

// Insertar nueva sección vacía debajo del encabezado
const header = `# Changelog\n\nTodos los cambios notables de Pliego se documentan aquí.\nFormato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).\n\n`;
const newSection = `## [${newVersion}] — ${today}\n\n### Añadido\n- \n\n### Cambiado\n- \n\n### Corregido\n- \n\n`;

if (cl.startsWith("# Changelog")) {
  const rest = cl.slice(header.trimEnd().length).trimStart();
  fs.writeFileSync(clPath, header + newSection + rest);
} else {
  fs.writeFileSync(clPath, header + newSection + cl);
}
console.log(`✓ CHANGELOG.md — sección v${newVersion} añadida`);

// Confirmar en git
try {
  execSync(`git add "${pkgPath}" "${lockPath}" "${readmePath}" "${clPath}"`, { cwd: root });
  execSync(`git commit -m "chore: bump version to v${newVersion}"`, { cwd: root });
  console.log(`✓ Commit creado: chore: bump version to v${newVersion}`);
} catch (e) {
  console.warn("⚠ No se pudo hacer commit automático:", e.message);
}
