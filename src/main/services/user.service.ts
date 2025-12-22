// import prisma from "../db.js";

export async function createUser(data: { username: string; password: string }) {
  console.log("Api Hit createUser");
  return {
    id: data.username,
    username: data.username,
    password: data.password,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getUsers() {
  return [
    {
      id: "1",
      username: "admin",
      password: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}
