import ApiError from "../utils/apiError.util.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/authToken.util.js";
import prisma from "../db.js";

export async function loginService(data) {
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (user.password !== data.password) {
    throw new ApiError("Invalid password", 401);
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user: {
      ...user,
      password: undefined,
    },
  };
}

export async function refreshTokenService(refreshToken) {
  try {
    const jwt = (await import("jsonwebtoken")).default;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const newAccessToken = createAccessToken(user);

    return { accessToken: newAccessToken };
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new ApiError("Invalid or expired refresh token", 401);
    }
    throw error;
  }
}
