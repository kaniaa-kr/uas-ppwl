import { Elysia } from "elysia"
import { prisma } from "../db"
import jwt from "jsonwebtoken"

function getUserFromToken(authHeader: string | undefined) {
  if (!authHeader) return null
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"
    const token = authHeader.replace("Bearer ", "")
    return jwt.verify(token, JWT_SECRET) as { id: string }
  } catch {
    return null
  }
}

export const notifRoutes = new Elysia({ prefix: "/notifications" })

  // ====== GET /notifications/:userId ======
  .get("/:userId", async ({ params, set }) => {
    const userId = BigInt(params.userId)

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      set.status = 404
      return { error: "User tidak ditemukan" }
    }

    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      include: {
        actor: { select: { id: true, name: true, username: true, avatar_url: true } },
        post: { select: { id: true, content: true, image_url: true } },
      },
      orderBy: { created_at: "desc" },
    })

    return notifications.map((n) => ({
      ...n,
      id: n.id.toString(),
      user_id: n.user_id.toString(),
      actor_id: n.actor_id.toString(),
      post_id: n.post_id?.toString() ?? null,
      comment_id: n.comment_id?.toString() ?? null,
      actor: n.actor ? { ...n.actor, id: n.actor.id.toString() } : null,
      post: n.post ? { ...n.post, id: n.post.id.toString() } : null,
    }))
  })

  // ====== PATCH /notifications/:id/read ======
  .patch("/:id/read", async ({ params, headers, set }) => {
    const decoded = getUserFromToken(headers.authorization)
    if (!decoded) { set.status = 401; return { error: "Unauthorized" } }

    const id = BigInt(params.id)
    const notif = await prisma.notification.findUnique({ where: { id } })
    if (!notif) { set.status = 404; return { error: "Notifikasi tidak ditemukan" } }

    if (notif.user_id.toString() !== decoded.id) { set.status = 403; return { error: "Forbidden" } }

    const updated = await prisma.notification.update({
      where: { id },
      data: { is_read: true },
    })

    return {
      ...updated,
      id: updated.id.toString(),
      user_id: updated.user_id.toString(),
      actor_id: updated.actor_id.toString(),
      post_id: updated.post_id?.toString() ?? null,
      comment_id: updated.comment_id?.toString() ?? null,
    }
  })