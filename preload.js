const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mainWorld", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  go: (url) => ipcRenderer.invoke("go", url),
});
