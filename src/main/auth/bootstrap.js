import keytar from "keytar";
import { setAccessToken } from "./session.js";
import { refreshTokenService } from "../services/auth.service.js";

export async function bootstrapAuth() {
  const refreshToken = await keytar.getPassword(
    process.env.SERVICE_NAME,
    "refreshToken",
  );

  if (!refreshToken) {
    console.log("No refresh token found");
    return;
  }

  try {
    const result = await refreshTokenService(refreshToken);
    setAccessToken(result.accessToken);
    console.log("Auth bootstrapped successfully");
  } catch (error) {
    console.error("Failed to bootstrap auth:", error);
    await keytar.deletePassword(process.env.SERVICE_NAME, "refreshToken");
  }
}
