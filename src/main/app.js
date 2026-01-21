import { app, BrowserWindow } from "electron";
import { registerIPCHandlers } from "./ipc/index.js";
import { createMainWindow } from "./window.js";
import { bootstrapAuth } from "./auth/bootstrap.js";

export async function bootstrapApp() {
  await app.whenReady();
  await bootstrapAuth();

  registerIPCHandlers();

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}
