import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "./types";

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  user: {
    create: (payload) => ipcRenderer.invoke("user:create", payload),
    list: () => ipcRenderer.invoke("user:list"),
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
