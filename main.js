// Proceso principal de Electron para Pliego
const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// Una sola instancia de la app
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }

let win;

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
  } catch (_) { /* no bloquear el cierre si falla el guardado */ }
}

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
    frame: false,   // sin barra de título nativa (ni ícono ni texto); Pliego dibuja sus propios
                    // botones de minimizar/maximizar/cerrar en su topbar (ver preload.js)
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,   // oculta los globals de Node en el renderer (algunas libs, ej. tesseract.js,
                        // detectan mal "Node" en vez de "navegador" si "process" existe y eligen mal su código)
      preload: path.join(__dirname, "preload.js"),
      spellcheck: true
    }
  });

  if (state.maximized) win.maximize();

  win.on("close", saveWindowState);

  win.loadFile(path.join(__dirname, "renderer", "pliego-pdf.html"));

  // Controles propios de la ventana (sin marco nativo): minimizar/maximizar/cerrar,
  // expuestos al renderer de forma segura vía preload.js + contextBridge.
  ipcMain.on("win:minimize", () => win.minimize());
  ipcMain.on("win:toggleMaximize", () => { if (win.isMaximized()) win.unmaximize(); else win.maximize(); });
  ipcMain.on("win:close", () => win.close());
  win.on("maximize", () => win.webContents.send("win:maximized", true));
  win.on("unmaximize", () => win.webContents.send("win:maximized", false));

  // Abrir enlaces externos en el navegador del sistema, no dentro de la app
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) { shell.openExternal(url); return { action: "deny" }; }
    return { action: "allow" };
  });

  // Evitar que la ventana principal navegue a cualquier URL externa (p.ej. si un
  // PDF/HTML malicioso intenta forzar una navegación). Solo se permite recargar
  // el propio archivo local del renderer; cualquier otra navegación se bloquea
  // y, si es http(s), se reenvía al navegador del sistema.
  win.webContents.on("will-navigate", (event, url) => {
    const target = path.join(__dirname, "renderer", "pliego-pdf.html");
    const isSameFile = url === `file://${target.replace(/\\/g, "/")}` || url.startsWith(`file://${target.replace(/\\/g, "/")}`);
    if (isSameFile) return;
    event.preventDefault();
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
  });

  // Diálogo nativo "Guardar como" cuando Pliego descarga un archivo.
  // (Electron muestra el diálogo del sistema por defecto al no fijar savePath.)
  win.webContents.session.on("will-download", (event, item) => {
    // Sugerir nombre, extensión .pdf y filtro de tipo correcto en el diálogo nativo.
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
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Diálogo nativo "Abrir" (reemplaza al <input type="file"> del renderer para el botón
// "Abrir" principal): permite obtener la ruta absoluta real de cada archivo elegido,
// necesaria para poder "recordarlo" en la lista de Recientes y reabrirlo después.
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

// Reabrir un archivo de la lista de Recientes a partir de su ruta absoluta guardada.
// Si el archivo ya no existe (fue borrado/movido), devuelve { error:true } en vez de
// lanzar una excepción no controlada, para que el renderer pueda avisar al usuario.
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
