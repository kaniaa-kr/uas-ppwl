import "dotenv/config"
import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { prisma } from "./db"
import { authRoutes } from "./routes/auth"
import { postRoutes } from "./routes/posts"
import { commentRoutes } from "./routes/comments"
import { notifRoutes } from "./routes/notifications"
import { oauthRoutes } from "./routes/oauth"

export { prisma }

export function createApp() {
  const app = new Elysia()
    .use(cors({ 
      origin: "*",
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }))
    // Global error handler — selalu kembalikan JSON
    .onError(({ error, set, code }) => {
      console.error(`[ERROR] code=${code}`, error instanceof Error ? error.message : error)
      if (code === "VALIDATION") {
        set.status = 422
        return { error: "Validasi body gagal", detail: String((error as any).message ?? error) }
      }
      if (code === "NOT_FOUND") {
        set.status = 404
        return { error: "Endpoint tidak ditemukan" }
      }
      set.status = 500
      return { error: (error instanceof Error ? error.message : String(error)) || "Internal Server Error" }
    })
    .use(authRoutes)
    .use(oauthRoutes)
    .use(postRoutes)
    .use(commentRoutes)
    .use(notifRoutes)

    .get("/users", async ({ query, set }) => {
      if (query.key !== process.env.SECRET_KEY) {
        set.status = 401
        return { error: "Unauthorized" }
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
      return users.map((u) => ({ ...u, id: u.id.toString() }))
    })

    .get("/health", () => ({
      status: "ok",
      timestamp: new Date(),
      message: "Backend is running!",
    }))

  return app
}

if (!process.env.LAMBDA_TASK_ROOT && process.argv[1]?.includes("index.ts")) {
  const app = createApp()
  app.listen(process.env.PORT || 3000)
  console.log(`🦊 Backend berjalan di http://localhost:${app.server?.port}`)
}