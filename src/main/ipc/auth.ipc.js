import { ipcMain } from "electron";
import { loginService } from "../services/user.service.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { ipcHandler } from "./ipcWrapper.js";
import keytar from "keytar";
import {
  setAccessToken,
  getAccessToken,
  clearAllTokens,
} from "../auth/session.js";

export const registerAuthIPC = () => {
  ipcMain.handle(
    "auth:login",
    ipcHandler(async (payload, _event) => {
      const parsed = loginSchema.parse(payload);
      const res = await loginService(parsed);

      setAccessToken(res.accessToken);
      await keytar.setPassword(
        process.env.SERVICE_NAME,
        "refreshToken",
        res.refreshToken,
      );

      return {
        user: res.user,
      };
    }),
  );

  ipcMain.handle(
    "auth:logout",
    ipcHandler(async () => {
      await clearAllTokens();
      return { success: true };
    }),
  );

  ipcMain.handle(
    "auth:status",
    ipcHandler(async () => {
      const accessToken = getAccessToken();
      const refreshToken = await keytar.getPassword(
        process.env.SERVICE_NAME,
        "refreshToken",
      );

      return {
        isAuthenticated: !!accessToken,
        hasRefreshToken: !!refreshToken,
      };
    }),
  );
};
