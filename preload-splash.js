// Preload exclusivo de la ventana splash — contextIsolation + sandbox
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("splashBridge", {
  ready: () => ipcRenderer.send("splash:ready"),
  done:  () => ipcRenderer.send("splash:done"),
});
