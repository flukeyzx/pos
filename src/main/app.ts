import { app, BrowserWindow } from "electron";
import { registerIPCHandlers } from "./ipc/index.js";
import { createMainWindow } from "./window.js";

export async function bootstrapApp() {
  await app.whenReady();

  registerIPCHandlers();

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}
