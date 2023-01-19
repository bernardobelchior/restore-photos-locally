// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

const ipc = {
  openFileDialog: () => ipcRenderer.send("open-file-dialog"),
  openSaveDialog: (image: string) =>
    ipcRenderer.send("open-save-dialog", image),
  onInputImageLoaded: (
    listener: (event: IpcRendererEvent, base64Image: string) => void
  ) => ipcRenderer.on("displayInput", listener),
  onOutputImageLoaded: (
    listener: (event: IpcRendererEvent, base64Image: string) => void
  ) => ipcRenderer.on("displayOutput", listener),
  checkPrerequisites: () => ipcRenderer.send("check-prerequisites"),
  onCheckPrerequisitesOver: (
    listener: (
      event: IpcRendererEvent,
      status: { python: boolean; gfpgan: boolean }
    ) => void
  ) => ipcRenderer.on("check-prerequisites-over", listener),
  installPrerequisites: () => ipcRenderer.send("install-prerequisites"),
  onInstallPrerequisitesOver: (listener: (event: IpcRendererEvent) => void) =>
    ipcRenderer.on("install-prerequisites-over", listener),
  showLogs: () => ipcRenderer.send("show-logs"),
};

contextBridge.exposeInMainWorld("ipc", ipc);

declare global {
  interface Window {
    ipc: typeof ipc;
  }
}
