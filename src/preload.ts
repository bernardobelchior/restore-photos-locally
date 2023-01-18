// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openFileDialog: () => ipcRenderer.send("open-file-dialog"),
  openSaveDialog: (image: string) =>
    ipcRenderer.send("open-save-dialog", image),
  on: (...args) => ipcRenderer.on(...args),
  checkPrerequisites: () => ipcRenderer.send("check-prerequisites"),
  installPrerequisites: () => ipcRenderer.send("install-prerequisites"),
});
