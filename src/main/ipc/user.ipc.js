import { ipcMain } from "electron";
import {
  createUser,
  getUsers,
  loginService,
} from "../services/user.service.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { ipcHandler } from "./ipcWrapper.js";

export function registerUserIPC() {
  ipcMain.handle("user:create", async (_event, payload) => {
    const result = await createUser(payload);
    return result;
  });

  ipcMain.handle("user:list", async () => {
    const result = await getUsers();
    return result;
  });

  ipcMain.handle(
    "user:login",
    ipcHandler(async (payload, _event) => {
      const parsed = loginSchema.parse(payload);
      const result = await loginService(parsed);
      return result;
    })
  );
}
