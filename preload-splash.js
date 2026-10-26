const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("splashBridge", {
  ready:      () => ipcRenderer.send("splash:ready"),
  done:       () => ipcRenderer.send("splash:done"),
  onProgress: (cb) => ipcRenderer.on("splash:progress", (_e, d) => cb(d)),
  onFinish:   (cb) => ipcRenderer.once("splash:finish", () => cb()),
});
