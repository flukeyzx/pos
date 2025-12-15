import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
});
