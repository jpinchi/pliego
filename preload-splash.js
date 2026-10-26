// Preload exclusivo de la ventana splash.
// Expone solo lo necesario: saber cuándo el renderer principal está listo y cerrar la ventana.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("splashBridge", {
  onReady: (callback) => ipcRenderer.once("splash:ready", callback),
  close:   ()         => ipcRenderer.send("splash:close"),
});
