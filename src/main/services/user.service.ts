import prisma from "../db";

export async function createUser(data: { username: string; password: string }) {
  return prisma.user.create({
    data,
  });
}

export async function getUsers() {
  return prisma.user.findMany();
}
