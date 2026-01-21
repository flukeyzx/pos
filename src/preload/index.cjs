const { contextBridge, ipcRenderer } = require("electron");

const electronAPI = {
  user: {
    create: (payload) => {
      return ipcRenderer.invoke("user:create", payload);
    },
    list: () => {
      return ipcRenderer.invoke("user:list");
    },
  },
  auth: {
    login: (payload) => {
      return ipcRenderer.invoke("auth:login", payload);
    },
    logout: () => {
      return ipcRenderer.invoke("auth:logout");
    },
    status: () => {
      return ipcRenderer.invoke("auth:status");
    },
  },
  api: {
    getCurrentUser: () => {
      return ipcRenderer.invoke("api:getCurrentUser");
    },
    request: (endpoint, options) => {
      return ipcRenderer.invoke("api:request", { endpoint, options });
    },
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
