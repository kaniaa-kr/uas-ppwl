import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

// MENGISOLASI RUTE TIM LAIN YANG BELUM SELESAI
// import { authRoutes } from "./routes/auth"
import { postRoutes } from "./routes/posts"
// import { commentRoutes } from "./routes/comments"
// import { notifRoutes } from "./routes/notifications"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan di .env!")
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({ adapter })

const app = new Elysia()
  .use(cors({ origin: "*" }))
  // .use(authRoutes)       <-- Dimatikan sementara
  .use(postRoutes)       // <-- Hanya rute Evan yang menyala
  // .use(commentRoutes)    <-- Dimatikan sementara
  // .use(notifRoutes)      <-- Dimatikan sementara
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