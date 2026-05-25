import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (prisma) return prisma;

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL tidak ditemukan di .env!")
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  })
  
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })
  
  return prisma;
}
