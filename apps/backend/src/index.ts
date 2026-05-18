import "dotenv/config"
import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { authRoutes } from "./routes/auth"
import { postRoutes } from "./routes/posts"
import { commentRoutes } from "./routes/comments"
import { notifRoutes } from "./routes/notifications"

// Setup Prisma dengan Adapter PostgreSQL (wajib untuk Prisma v7)
export const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan di .env!")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({ adapter })

const app = new Elysia()
  .use(cors({ origin: "*" }))
  .use(authRoutes)
  .use(postRoutes)
  .use(commentRoutes)
  .use(notifRoutes)
  .get("/users", async ({ query, set }) => {
    if (query.key !== process.env.SECRET_KEY) {
      set.status = 401
      return { error: "Unauthorized" }
    }
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        provider: true,
        created_at: true,
      },
    })
  })
  .get("/health", () => ({ status: "ok", timestamp: new Date() }))
  .listen(process.env.PORT || 3000)

console.log(`🦊 Backend berjalan di http://localhost:${app.server?.port}`)