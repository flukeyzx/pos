// import prisma from "../db.js";

export async function createUser(data) {
  console.log("[MAIN PROCESS] Api Hit createUser with:", data.username);
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
