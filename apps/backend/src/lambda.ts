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
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"

// Ambil config dari Parameter Store
const ssm = new SSMClient({ region: "us-east-1" })

async function getParam(name: string) {
  const res = await ssm.send(new GetParameterCommand({
    Name: name,
    WithDecryption: true
  }))
  return res.Parameter?.Value || ""
}

// Init Prisma
const connectionString = process.env.DATABASE_URL || ""
const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({ adapter })

const app = new Elysia()
  .use(cors({
    origin: process.env.FRONTEND_URL || "*"
  }))
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
      select: { id: true, name: true, username: true, email: true, provider: true, created_at: true }
    })
  })
  .get("/health", () => ({ status: "ok", timestamp: new Date() }))

export default app