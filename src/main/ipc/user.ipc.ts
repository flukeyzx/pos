import { ipcMain } from "electron";
import { createUser, getUsers } from "../services/user.service.js";

export function registerUserIPC() {
  ipcMain.handle("user:create", async (_event, payload) => {
    return await createUser(payload);
  });

  ipcMain.handle("user:list", async () => {
    return await getUsers();
  });
}
