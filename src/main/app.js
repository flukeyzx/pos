import { app, BrowserWindow } from "electron";
import { registerIPCHandlers } from "./ipc/index.js";
import { createMainWindow } from "./window.js";

export async function bootstrapApp() {
  console.log("[MAIN PROCESS] Bootstrap starting");
  await app.whenReady();

  console.log("[MAIN PROCESS] App ready, registering IPC handlers");
  registerIPCHandlers();

  console.log("[MAIN PROCESS] Creating main window");
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log("[MAIN PROCESS] Activating app, creating window");
      createMainWindow();
    }
  });
}
