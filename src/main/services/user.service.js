import prisma from "../db.js";
import bcrypt from "bcryptjs";

export async function createUserService(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "User created successfully",
    user: {
      id: user.id,
      username: user.username,
    },
  };
}

export async function listUsersService() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
}
