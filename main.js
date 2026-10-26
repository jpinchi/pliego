// Proceso principal de Electron para Pliego
const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// Una sola instancia de la app
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }

let win;
let splash;

// Recordar tamaño/posición de la ventana entre sesiones.
const stateFile = path.join(app.getPath("userData"), "window-state.json");
function loadWindowState() {
  try { return JSON.parse(fs.readFileSync(stateFile, "utf8")); }
  catch (_) { return {}; }
}
function saveWindowState() {
  if (!win) return;
  try {
    const bounds = win.getBounds();
    fs.writeFileSync(stateFile, JSON.stringify({ ...bounds, maximized: win.isMaximized() }));
  } catch (_) {}
}

// ── Splash screen ─────────────────────────────────────────────────────────────
function createSplash() {
  splash = new BrowserWindow({
    width: 480,
    height: 300,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    center: true,
    alwaysOnTop: true,
    icon: path.join(__dirname, "build", "icon.ico"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload-splash.js"),
    }
  });
  splash.loadFile(path.join(__dirname, "renderer", "splash.html"));

  // El renderer del splash pide cerrarse una vez hecha la animación de salida
  ipcMain.once("splash:close", () => {
    if (splash && !splash.isDestroyed()) splash.close();
    splash = null;
    if (win && !win.isDestroyed()) { win.show(); win.focus(); }
  });
}

// ── Ventana principal ─────────────────────────────────────────────────────────
function createWindow() {
  const state = loadWindowState();
  win = new BrowserWindow({
    width: state.width || 1280,
    height: state.height || 860,
    x: state.x,
    y: state.y,
    minWidth: 920,
    minHeight: 600,
    backgroundColor: "#13161c",
    icon: path.join(__dirname, "build", "icon.ico"),
    frame: false,
    show: false,   // se muestra solo cuando el splash termina
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
      spellcheck: true
    }
  });

  if (state.maximized) win.maximize();
  win.on("close", saveWindowState);
  win.loadFile(path.join(__dirname, "renderer", "pliego-pdf.html"));

  // Cuando el renderer principal termina de cargar, avisamos al splash
  win.webContents.once("did-finish-load", () => {
    if (splash && !splash.isDestroyed()) {
      splash.webContents.send("splash:ready");
    } else {
      // Si el splash ya no existe (arranque muy rápido), mostrar directamente
      win.show();
      win.focus();
    }
  });

  // Controles de ventana propios (sin marco nativo)
  ipcMain.on("win:minimize", () => win.minimize());
  ipcMain.on("win:toggleMaximize", () => { if (win.isMaximized()) win.unmaximize(); else win.maximize(); });
  ipcMain.on("win:close", () => win.close());
  win.on("maximize", () => win.webContents.send("win:maximized", true));
  win.on("unmaximize", () => win.webContents.send("win:maximized", false));

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) { shell.openExternal(url); return { action: "deny" }; }
    return { action: "allow" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    const target = path.join(__dirname, "renderer", "pliego-pdf.html");
    const isSameFile = url === `file://${target.replace(/\\/g, "/")}` || url.startsWith(`file://${target.replace(/\\/g, "/")}`);
    if (isSameFile) return;
    event.preventDefault();
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
  });

  win.webContents.session.on("will-download", (event, item) => {
    const suggestedName = item.getFilename().toLowerCase().endsWith(".pdf")
      ? item.getFilename()
      : `${item.getFilename()}.pdf`;
    item.setSaveDialogOptions({
      title: "Guardar como",
      defaultPath: suggestedName,
      filters: [
        { name: "Documento PDF", extensions: ["pdf"] },
        { name: "Todos los archivos", extensions: ["*"] }
      ]
    });
  });
}

app.whenReady().then(() => {
  createSplash();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Diálogo nativo "Abrir"
ipcMain.handle("dialog:openPdf", async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "PDF e imágenes", extensions: ["pdf", "png", "jpg", "jpeg", "webp", "gif", "bmp"] }]
  });
  if (result.canceled || !result.filePaths.length) return null;
  const files = [];
  for (const filePath of result.filePaths) {
    const bytes = await fs.promises.readFile(filePath);
    files.push({ path: filePath, name: path.basename(filePath), bytes });
  }
  return files;
});

ipcMain.handle("file:readByPath", async (event, filePath) => {
  try {
    const bytes = await fs.promises.readFile(filePath);
    return { name: path.basename(filePath), bytes };
  } catch (_) {
    return { error: true };
  }
});

app.on("second-instance", () => {
  if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
