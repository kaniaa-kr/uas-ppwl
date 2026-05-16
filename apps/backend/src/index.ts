import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { PrismaClient } from "@prisma/client"
import { authRoutes } from "./routes/auth"
import { postRoutes } from "./routes/posts"
import { commentRoutes } from "./routes/comments"
import { notifRoutes } from "./routes/notifications"

export const prisma = new PrismaClient()

const app = new Elysia()
  .use(cors({ origin: "*" }))
  .use(authRoutes)
  .use(postRoutes)
  .use(commentRoutes)
  .use(notifRoutes)
  // Endpoint khusus untuk dosen/asisten cek data
  .get("/users", async ({ query }) => {
    if (query.key !== process.env.SECRET_KEY) {
      return { error: "Unauthorized. Sertakan ?key=your-secret-key" }
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        provider: true,
        created_at: true,
      },
    })
    return users
  })
  .get("/health", () => ({ status: "ok", timestamp: new Date() }))
  .listen(process.env.PORT || 3000)

console.log(`🦊 Backend berjalan di http://localhost:${app.server?.port}`)