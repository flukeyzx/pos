import { ipcMain } from "electron";
import { createUser, getUsers } from "../services/user.service.js";

export function registerUserIPC() {
  ipcMain.handle("user:create", async (_event, payload) => {
    const result = await createUser(payload);
    return result;
  });

  ipcMain.handle("user:list", async () => {
    const result = await getUsers();
    return result;
  });
}
