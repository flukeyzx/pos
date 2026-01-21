import { ipcMain } from "electron";
import { authenticatedRequest } from "../network/authFetch.js";
import { ipcHandler } from "./ipcWrapper.js";

export const registerApiIPC = () => {
  // Example protected API endpoint
  ipcMain.handle(
    "api:getCurrentUser",
    ipcHandler(async () => {
      // This would be your actual API endpoint
      // For now, we'll simulate getting user info from token
      return { message: "This is a protected endpoint" };
    }),
  );

  // Generic authenticated request handler
  ipcMain.handle(
    "api:request",
    ipcHandler(async ({ endpoint, options }) => {
      return await authenticatedRequest(endpoint, options);
    }),
  );
};
