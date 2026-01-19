import prisma from "../db.js";
import ApiError from "../utils/apiError.util.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/authToken.util.js";

export async function createUser(data) {
  const newUser = await prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
    },
  });
  return newUser;
}

export async function getUsers() {
  return await prisma.user.findMany();
}

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
