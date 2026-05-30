import { PrismaClient } from "../src/generated/prisma-pg"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

// 1. Ambil URL secara absolut dari env AWS Lambda
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL tidak terdeteksi di Environment AWS!");
}

// 2. Konfigurasi Pool PG secara eksplisit
const pool = new pg.Pool({ 
  connectionString: connectionString,
  ssl: { 
        rejectUnauthorized: false 
      }
})

const adapter = new PrismaPg(pool)

// 3. Jangan masukkan properti datasources agar TypeScript tidak marah (type never)
const prismaInstance = new PrismaClient({ adapter })

export function getPrisma() {
  return prismaInstance
}