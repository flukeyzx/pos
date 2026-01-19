import { PrismaClient } from "../main/generated/prisma/client.ts";
import { config } from "dotenv";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

config();

const sqlite = new Database("dev.db");
const adapter = new PrismaBetterSqlite3(sqlite);

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
