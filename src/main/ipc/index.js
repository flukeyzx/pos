import { registerUserIPC } from "./user.ipc.js";
import { registerAuthIPC } from "./auth.ipc.js";

export function registerIPCHandlers() {
  registerUserIPC();
  registerAuthIPC();
}
