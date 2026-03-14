import { ipcMain } from "electron";
import { createUserService, listUsersService } from "../services/user.service.js";
import { createUserSchema } from "../schemas/user.schema.js";
import { ipcHandler } from "./ipcWrapper.js";

export function registerUserIPC() {
  ipcMain.handle(
    "user:create",
    ipcHandler(async (payload) => {
      const validatedData = createUserSchema.parse(payload);
      return await createUserService(validatedData);
    })
  );

  ipcMain.handle(
    "user:list",
    ipcHandler(async () => {
      return await listUsersService();
    })
  );
}
