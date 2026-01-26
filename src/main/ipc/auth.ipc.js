import { ipcMain } from "electron";
import {
  loginService,
  getCurrentUser,
  logout,
  isAuthenticated,
} from "../services/auth.service.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { ipcHandler } from "./ipcWrapper.js";

export const registerAuthIPC = () => {
  ipcMain.handle(
    "auth:login",
    ipcHandler(async (payload, _event) => {
      const parsed = loginSchema.parse(payload);
      const result = await loginService(parsed);
      return result;
    }),
  );

  ipcMain.handle(
    "auth:logout",
    ipcHandler(async () => {
      logout();
      return { success: true };
    }),
  );

  ipcMain.handle(
    "auth:status",
    ipcHandler(async () => {
      return {
        isAuthenticated: isAuthenticated(),
        user: getCurrentUser(),
      };
    }),
  );

  ipcMain.handle(
    "auth:currentUser",
    ipcHandler(async () => {
      return getCurrentUser();
    }),
  );
};
