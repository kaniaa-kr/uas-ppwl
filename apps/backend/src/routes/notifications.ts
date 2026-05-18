import { Elysia } from "elysia"
import { prisma } from "../index"

export const notifRoutes = new Elysia({ prefix: "/notifications" })

  // ====== GET /notifications/:userId ======
  // Ambil semua notifikasi untuk 1 user
  .get("/:userId", async ({ params, set }) => {
    const userId = BigInt(params.userId)

    // Validasi: user ada?
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      set.status = 404
      return { error: "User tidak ditemukan" }
    }

    // Ambil notifikasi
    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar_url: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image_url: true,
          },
        },
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
      actor: {
        ...n.actor,
        id: n.actor.id.toString(),
      },
      post: n.post
        ? {
            ...n.post,
            id: n.post.id.toString(),
          }
        : null,
    }))
  })

  // ====== PATCH /notifications/:id/read ======
  // Mark notifikasi sebagai sudah dibaca
  .patch("/:id/read", async ({ params, set }) => {
    const id = BigInt(params.id)

    // Validasi: notif ada?
    const notif = await prisma.notification.findUnique({
      where: { id },
    })
    if (!notif) {
      set.status = 404
      return { error: "Notifikasi tidak ditemukan" }
    }

    // Update is_read = true
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