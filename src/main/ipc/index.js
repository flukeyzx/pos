import { registerUserIPC } from "./user.ipc.js";
import { registerAuthIPC } from "./auth.ipc.js";
import { registerApiIPC } from "./api.ipc.js";

export function registerIPCHandlers() {
  registerUserIPC();
  registerAuthIPC();
  registerApiIPC();
}
