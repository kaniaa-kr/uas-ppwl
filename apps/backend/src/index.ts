import "dotenv/config"
import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { PrismaClient } from "@prisma/client"
import { getPrisma as defaultGetPrisma } from "../prisma/dbPostgres"
import { authRoutes } from "./routes/auth"
import { postRoutes } from "./routes/posts"
import { commentRoutes } from "./routes/comments"
import { notifRoutes } from "./routes/notifications"

export let prisma: PrismaClient;

export function createApp(getPrismaFunc?: () => PrismaClient) {
  prisma = getPrismaFunc ? getPrismaFunc() : defaultGetPrisma();

  const app = new Elysia()
    .use(cors({ origin: "*" }))
    .use(authRoutes)
    .use(postRoutes)
    .use(commentRoutes)
    .use(notifRoutes)

    // Endpoint khusus untuk dosen/asisten check data
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

    // Health check endpoint
    .get("/health", () => ({
      status: "ok",
      timestamp: new Date(),
      message: "Backend is running!",
    }))

  return app;
}

// Run server locally if not in lambda environment
if (!process.env.LAMBDA_TASK_ROOT && process.argv[1]?.includes("index.ts")) {
  const app = createApp();
  app.listen(process.env.PORT || 3000)
  console.log(`🦊 Backend berjalan di http://localhost:${app.server?.port}`)
}