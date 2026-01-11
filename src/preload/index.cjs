const { contextBridge, ipcRenderer } = require("electron");

const electronAPI = {
  user: {
    create: (payload) => {
      return ipcRenderer.invoke("user:create", payload);
    },
    list: () => {
      return ipcRenderer.invoke("user:list");
    },
    login: (payload) => {
      return ipcRenderer.invoke("user:login", payload);
    },
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
