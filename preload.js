// Preload de Pliego: expone al renderer, de forma segura (contextIsolation + sandbox),
// solo los controles mínimos de ventana que necesita la topbar propia (sin marco nativo).
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("pliegoWindow", {
  minimize: () => ipcRenderer.send("win:minimize"),
  toggleMaximize: () => ipcRenderer.send("win:toggleMaximize"),
  close: () => ipcRenderer.send("win:close"),
  onMaximizedChange: (callback) => {
    ipcRenderer.on("win:maximized", (_event, isMaximized) => callback(isMaximized));
  }
});

// Puente para el flujo de "Abrir" con diálogo nativo y la lista de "Archivos recientes":
// el renderer no tiene acceso a fs ni a rutas reales, así que estos métodos pasan por
// el proceso principal para leer archivos por ruta absoluta.
contextBridge.exposeInMainWorld("pliegoFiles", {
  openDialog: () => ipcRenderer.invoke("dialog:openPdf"),
  readByPath: (filePath) => ipcRenderer.invoke("file:readByPath", filePath)
});
