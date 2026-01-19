import { PrismaClient } from "../main/generated/prisma/client.ts";
import { config } from "dotenv";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

config();

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
