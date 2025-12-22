// import { PrismaClient } from "./generated/prisma/client.js";
// import { config } from "dotenv";
// import { PrismaPg } from "@prisma/adapter-pg";
// import pg from "pg";
// const { Pool } = pg;

// config();

// console.log(process.env.DATABASE_URL);

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// const adapter = new PrismaPg(pool);

// const globalForPrisma = globalThis as unknown as {
//   prisma?: PrismaClient;
// };

// const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

// export default prisma;
