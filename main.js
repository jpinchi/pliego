// Proceso principal de Electron para Pliego
const { app, BrowserWindow, Menu, shell, dialog, ipcMain, systemPreferences } = require("electron");
const path = require("path");
const fs   = require("fs");
const { autoUpdater } = require("electron-updater");


// Una sola instancia
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }

let win;
let splash;
let mainReady  = false;   // la ventana principal terminó de cargar
let splashDone = false;   // el video terminó de reproducirse
let splashShown = false;  // la ventana splash ya se mostró

// ── Registro de inicio ────────────────────────────────────────────────────────
const logDir  = path.join(app.getPath("userData"), "logs");
const logFile = path.join(logDir, "inicio.log");
let t0 = Date.now();
function logLine(msg) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(logFile, line);
  } catch (_) {}
}

// ── Ajuste de splash guardado ─────────────────────────────────────────────────
const settingsFile = path.join(app.getPath("userData"), "splash-settings.json");
function loadSplashSettings() {
  try { return JSON.parse(fs.readFileSync(settingsFile, "utf8")); }
  catch (_) { return { mode: "full" }; }   // full | quiet | off
}
function saveSplashSettings(s) {
  try { fs.writeFileSync(settingsFile, JSON.stringify(s)); } catch (_) {}
}

// ── Estado de ventana principal ───────────────────────────────────────────────
const stateFile = path.join(app.getPath("userData"), "window-state.json");
function loadWindowState() {
  try { return JSON.parse(fs.readFileSync(stateFile, "utf8")); }
  catch (_) { return {}; }
}
function saveWindowState() {
  if (!win) return;
  try {
    const b = win.getBounds();
    fs.writeFileSync(stateFile, JSON.stringify({ ...b, maximized: win.isMaximized() }));
  } catch (_) {}
}

// ── Condiciones para no mostrar el splash ─────────────────────────────────────
function shouldSkipSplash() {
  const args = process.argv;
  if (args.includes("--hidden"))        return "hidden-arg";
  if (args.includes("--no-splash"))     return "no-splash-arg";
  if (process.env.PLIEGO_TEST_NO_SPLASH === "1") return "test-env";
  const settings = loadSplashSettings();
  if (settings.mode === "off")          return "user-setting-off";
  return null;
}

function useQuietSplash() {
  const settings = loadSplashSettings();
  if (settings.mode === "quiet") return true;
  try {
    return systemPreferences.getAnimationSettings().prefersReducedMotion;
  } catch (_) { return false; }
}

// ── Mostrar ventana principal ─────────────────────────────────────────────────
function showMain() {
  if (win && !win.isDestroyed()) {
    win.show();
    win.focus();
  }
}

let finished = false;
function tryFinish() {
  if (finished || !mainReady || !splashDone) return;
  finished = true;
  logLine(`splash terminó OK — ${Date.now() - t0}ms desde inicio`);
  showMain();
  const s = splash;
  splash = null;
  if (s && !s.isDestroyed()) {
    // El splash se desvanece encima de la app ya visible y luego se cierra
    s.webContents.send("splash:fade");
    setTimeout(() => { if (!s.isDestroyed()) s.close(); }, 280);
  }
}

// ── Splash ────────────────────────────────────────────────────────────────────
function createSplash() {
  const skipReason = shouldSkipSplash();
  if (skipReason) {
    logLine(`splash omitido: ${skipReason}`);
    splashDone = true;
    return;
  }

  const quiet = useQuietSplash();
  logLine(`splash iniciando — modo: ${quiet ? "quiet" : "full"}, Windows ${process.getSystemVersion()}`);

  splash = new BrowserWindow({
    width:  520,
    height: 320,
    frame:         false,
    transparent:   false,
    backgroundColor: "#20242c",
    focusable:     false,
    alwaysOnTop:   true,
    skipTaskbar:   true,
    show:          false,
    center:        true,
    resizable:     false,
    maximizable:   false,
    fullscreenable: false,
    icon: path.join(__dirname, "build", "icon.ico"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration:  false,
      sandbox:          true,
      preload: path.join(__dirname, "preload-splash.js"),
    },
  });

  splash.setIgnoreMouseEvents(true);
  const wc = splash.webContents;
  wc.once("did-start-loading", () => logLine(`splash:start-loading — ${Date.now() - t0}ms`));
  wc.once("dom-ready",         () => logLine(`splash:dom-ready — ${Date.now() - t0}ms`));
  splash.loadFile(
    path.join(__dirname, "renderer", "splash.html"),
    { query: { quiet: quiet ? "1" : "0", v: app.getVersion() } }
  );

  // La animación CSS está lista → mostrar la ventana
  ipcMain.once("splash:ready", () => {
    logLine(`splash:ready — ${Date.now() - t0}ms`);
    if (splash && !splash.isDestroyed()) {
      splash.showInactive();
      splashShown = true;
    }
    // Si la ventana principal ya cargó mientras esperábamos, esperar el resto de la animación
    if (mainReady) {
      setTimeout(() => { splashDone = true; tryFinish(); }, 2200);
    }
  });

  // El video terminó → cerrar splash y mostrar app
  ipcMain.once("splash:done", () => {
    logLine(`splash:done — ${Date.now() - t0}ms`);
    splashDone = true;
    tryFinish();
  });

  // Topes de seguridad
  // 6 s: si no se mostró todavía, dar por perdido
  setTimeout(() => {
    if (!splashShown) {
      logLine("splash:timeout-6s — no mostrado, continuando");
      splashDone = true;
      tryFinish();
    }
  }, 6000);

  // 12 s: tope absoluto
  setTimeout(() => {
    if (!splashDone) {
      logLine("splash:timeout-12s — tope absoluto");
      splashDone = true;
      tryFinish();
    }
  }, 12000);
}

// ── Ventana principal ─────────────────────────────────────────────────────────
function createWindow() {
  if (win && !win.isDestroyed()) return;
  const state = loadWindowState();
  win = new BrowserWindow({
    width:  state.width  || 1280,
    height: state.height || 860,
    x: state.x,
    y: state.y,
    minWidth:  920,
    minHeight: 600,
    backgroundColor: "#13161c",
    icon: path.join(__dirname, "build", "icon.ico"),
    frame: false,
    show:  false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration:  false,
      sandbox:          true,
      preload: path.join(__dirname, "preload.js"),
      spellcheck: true,
    },
  });

  if (state.maximized) win.maximize();
  win.on("close", saveWindowState);
  win.loadFile(path.join(__dirname, "renderer", "pliego-pdf.html"));

  win.webContents.once("did-finish-load", () => {
    logLine(`main:did-finish-load — ${Date.now() - t0}ms`);
    mainReady = true;
    ipcMain.emit("main:ready");
    tryFinish();
  });

  ipcMain.on("win:minimize",       () => win.minimize());
  ipcMain.on("win:toggleMaximize", () => { if (win.isMaximized()) win.unmaximize(); else win.maximize(); });
  ipcMain.on("win:close",          () => win.close());
  win.on("maximize",   () => win.webContents.send("win:maximized", true));
  win.on("unmaximize", () => win.webContents.send("win:maximized", false));

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) { shell.openExternal(url); return { action: "deny" }; }
    return { action: "allow" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    const target = path.join(__dirname, "renderer", "pliego-pdf.html");
    const same = url === `file://${target.replace(/\\/g, "/")}` || url.startsWith(`file://${target.replace(/\\/g, "/")}`);
    if (same) return;
    event.preventDefault();
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
  });

  win.webContents.session.on("will-download", (event, item) => {
    const name = item.getFilename().toLowerCase().endsWith(".pdf")
      ? item.getFilename()
      : `${item.getFilename()}.pdf`;
    item.setSaveDialogOptions({
      title: "Guardar como",
      defaultPath: name,
      filters: [
        { name: "Documento PDF",    extensions: ["pdf"] },
        { name: "Todos los archivos", extensions: ["*"] },
      ],
    });
  });
}

// ── Auto-actualización ────────────────────────────────────────────────────────
function setupAutoUpdater() {
  // No verificar actualizaciones en desarrollo (npm start sin empaquetar)
  if (!app.isPackaged) return;

  autoUpdater.autoDownload    = true;   // descargar en segundo plano
  autoUpdater.autoInstallOnAppQuit = true; // instalar al cerrar

  autoUpdater.on("checking-for-update", () => {
    logLine(`update: buscando (versión actual v${app.getVersion()})`);
  });

  autoUpdater.on("update-not-available", (info) => {
    logLine(`update: sin actualizaciones — la última publicada es v${info.version}`);
  });

  autoUpdater.on("update-available", (info) => {
    logLine(`update disponible: v${info.version}`);
    if (win && !win.isDestroyed()) {
      win.webContents.send("update:available", { version: info.version });
    }
  });

  autoUpdater.on("update-downloaded", (info) => {
    logLine(`update descargado: v${info.version}`);
    if (win && !win.isDestroyed()) {
      win.webContents.send("update:downloaded", { version: info.version });
    }
  });

  autoUpdater.on("error", (err) => {
    logLine(`update error: ${err.message}`);
  });

  // Verificar 5 segundos después de que la ventana principal esté lista
  ipcMain.once("main:ready", () => {
    setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 5000);
  });
}

// Instalar actualización descargada (el renderer lo pide)
ipcMain.handle("update:install", () => {
  // Silencioso: el instalador es tipo asistente (oneClick:false) y si no abriría el asistente completo.
  // Segundo argumento: volver a abrir Pliego al terminar.
  logLine("update: instalando y reiniciando");
  autoUpdater.quitAndInstall(true, true);
});

// ── Ajuste del splash desde preferencias ─────────────────────────────────────
ipcMain.handle("splash:getSettings", () => loadSplashSettings());
ipcMain.handle("splash:setSettings", (_, s) => { saveSplashSettings(s); return true; });

// ── Diálogos / archivo ───────────────────────────────────────────────────────
ipcMain.handle("dialog:openPdf", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "PDF e imágenes", extensions: ["pdf","png","jpg","jpeg","webp","gif","bmp"] }],
  });
  if (result.canceled || !result.filePaths.length) return null;
  const files = [];
  for (const fp of result.filePaths) {
    const bytes = await fs.promises.readFile(fp);
    files.push({ path: fp, name: path.basename(fp), bytes });
  }
  return files;
});

ipcMain.handle("file:readByPath", async (_, filePath) => {
  try {
    const bytes = await fs.promises.readFile(filePath);
    return { name: path.basename(filePath), bytes };
  } catch (_) { return { error: true }; }
});

// ── Arranque ──────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  logLine(`app:ready — plataforma ${process.platform}, v${app.getVersion()}, proceso vivo hace ${Math.round(process.uptime() * 1000)}ms`);  setupAutoUpdater();
  createSplash();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("second-instance", () => {
  if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
