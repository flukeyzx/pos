const { contextBridge, ipcRenderer } = require("electron");

console.log("[PRELOAD] Script loaded successfully");

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
const electronAPI = {
  user: {
    create: (payload) => {
      console.log("[PRELOAD] user.create called with:", payload);
      return ipcRenderer.invoke("user:create", payload);
    },
    list: () => {
      console.log("[PRELOAD] user.list called");
      return ipcRenderer.invoke("user:list");
    },
  },
};

console.log("[PRELOAD] electronAPI exposed:", electronAPI);
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
