import { BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createMainWindow() {
  const preloadPath = path.join(__dirname, "../preload/index.cjs");
  console.log("[MAIN WINDOW] Preload path:", preloadPath);
  console.log("[MAIN WINDOW] Preload exists:", fs.existsSync(preloadPath));

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");

  // Open DevTools in development
  if (process.env.NODE_ENV !== "production") {
    win.webContents.openDevTools();
  }

  return win;
}
