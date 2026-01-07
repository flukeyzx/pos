import { ipcMain } from "electron";
import { createUser, getUsers } from "../services/user.service.js";

export function registerUserIPC() {
  console.log("[MAIN PROCESS] Registering user IPC handlers");

  ipcMain.handle("user:create", async (_event, payload) => {
    console.log(
      "[MAIN PROCESS] IPC user:create received with payload:",
      payload
    );
    const result = await createUser(payload);
    console.log("[MAIN PROCESS] IPC user:create result:", result);
    return result;
  });

  ipcMain.handle("user:list", async () => {
    console.log("[MAIN PROCESS] IPC user:list received");
    const result = await getUsers();
    console.log("[MAIN PROCESS] IPC user:list result:", result);
    return result;
  });
}
