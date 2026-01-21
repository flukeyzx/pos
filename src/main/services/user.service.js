import prisma from "../db.js";

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
