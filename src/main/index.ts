import { app } from "electron";
import { bootstrapApp } from "./app";

bootstrapApp();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
