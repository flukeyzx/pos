import keytar from "keytar";
import { getAccessToken, setAccessToken } from "../auth/session.js";
import { refreshTokenService } from "../services/auth.service.js";

let isRefreshing = false;
let refreshPromise = null;

export async function authFetch(url, options = {}) {
  const SERVICE_NAME = process.env.SERVICE_NAME;

  // Get current access token
  let accessToken = getAccessToken();

  // If no access token, try to get one from refresh token
  if (!accessToken) {
    const refreshToken = await keytar.getPassword(SERVICE_NAME, "refreshToken");
    if (refreshToken) {
      try {
        const result = await refreshTokenService(refreshToken);
        accessToken = result.accessToken;
        setAccessToken(accessToken);
      } catch (error) {
        // Refresh token is invalid, clear it
        await keytar.deletePassword(SERVICE_NAME, "refreshToken");
        throw new Error("Authentication required");
      }
    } else {
      throw new Error("No authentication tokens available");
    }
  }

  // Make the initial request
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // If 401, try to refresh and retry once
  if (response.status === 401) {
    if (isRefreshing) {
      // Wait for the ongoing refresh
      await refreshPromise;
    } else {
      // Start refresh process
      isRefreshing = true;
      refreshPromise = performRefresh();

      try {
        await refreshPromise;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Retry the request with new token
    const newAccessToken = getAccessToken();
    if (newAccessToken) {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } else {
      throw new Error("Authentication failed after refresh");
    }
  }

  return response;
}

async function performRefresh() {
  const SERVICE_NAME = process.env.SERVICE_NAME;
  const refreshToken = await keytar.getPassword(SERVICE_NAME, "refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const result = await refreshTokenService(refreshToken);
    setAccessToken(result.accessToken);
    console.log("Token refreshed successfully");
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear invalid refresh token
    await keytar.deletePassword(SERVICE_NAME, "refreshToken");
    setAccessToken(null);
    throw error;
  }
}

// Utility function for authenticated API calls
export async function authenticatedRequest(endpoint, options = {}) {
  try {
    const response = await authFetch(endpoint, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Authenticated request failed:", error);
    throw error;
  }
}
