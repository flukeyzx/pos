import keytar from "keytar";

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

export async function clearAllTokens() {
  clearAccessToken();
  try {
    await keytar.deletePassword(process.env.SERVICE_NAME, "refreshToken");
  } catch (error) {
    // Ignore if no token exists
  }
}
