import { Elysia, t } from "elysia"
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

export const commentRoutes = new Elysia({ prefix: "/comments" })

  // ====== GET /comments/post/:postId ======
  .get("/post/:postId", async ({ params, set }) => {
    const postId = BigInt(params.postId)

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      set.status = 404
      return { error: "Post tidak ditemukan" }
    }

    const comments = await prisma.comment.findMany({
      where: { post_id: postId },
      include: {
        user: { select: { id: true, name: true, username: true, avatar_url: true } },
      },
      orderBy: { created_at: "asc" },
    })

    return comments.map((c) => ({
      ...c,
      id: c.id.toString(),
      post_id: c.post_id.toString(),
      user_id: c.user_id.toString(),
      parent_id: c.parent_id?.toString() ?? null,
      // 🚨 Ditambahkan pengecekan c.user ? untuk menghindari crash jika user null
      user: c.user ? { ...c.user, id: c.user.id.toString() } : null,
    }))
  })

  // ====== POST /comments ======
  .post(
    "/",
    async ({ body, headers, set }) => {
      const decoded = getUserFromToken(headers.authorization)
      if (!decoded) { set.status = 401; return { error: "Unauthorized" } }

      // 🚨 Validasi user aktif di DB
      const userExists = await prisma.user.findUnique({ where: { id: BigInt(decoded.id) } })
      if (!userExists) { set.status = 401; return { error: "Sesi tidak valid, silakan login kembali." } }

      const { post_id, content, parent_id } = body

      const post = await prisma.post.findUnique({ where: { id: BigInt(post_id) } })
      if (!post) { set.status = 404; return { error: "Post tidak ditemukan" } }
      
      if (parent_id) {
        const parentComment = await prisma.comment.findUnique({ where: { id: BigInt(parent_id) } })
        if (!parentComment) { set.status = 404; return { error: "Komentar induk tidak ditemukan" } }
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          post_id: BigInt(post_id),
          user_id: BigInt(decoded.id),
          parent_id: parent_id ? BigInt(parent_id) : null,
        },
        include: {
          user: { select: { id: true, name: true, username: true, avatar_url: true } },
        },
      })

      if (post.user_id.toString() !== decoded.id) {
        await prisma.notification.create({
          data: {
            user_id: post.user_id,
            actor_id: BigInt(decoded.id),
            type: "comment",
            post_id: BigInt(post_id),
            comment_id: comment.id,
          },
        }).catch(() => {})
      }

      return {
        ...comment,
        id: comment.id.toString(),
        post_id: comment.post_id.toString(),
        user_id: comment.user_id.toString(),
        parent_id: comment.parent_id?.toString() ?? null,
        user: comment.user ? { ...comment.user, id: comment.user.id.toString() } : null,
      }
    },
    {
      body: t.Object({
        post_id: t.String(),
        content: t.String({ minLength: 1 }),
        parent_id: t.Optional(t.String()),
      }),
    }
  )

  // ====== DELETE /comments/:id ======
  .delete("/:id", async ({ params, headers, set }) => {
    const decoded = getUserFromToken(headers.authorization)
    if (!decoded) { set.status = 401; return { error: "Unauthorized" } }

    const comment = await prisma.comment.findUnique({ where: { id: BigInt(params.id) } })
    if (!comment) { set.status = 404; return { error: "Komentar tidak ditemukan" } }

    if (comment.user_id.toString() !== decoded.id) { set.status = 403; return { error: "Forbidden" } }

    await prisma.comment.delete({ where: { id: BigInt(params.id) } })
    return { message: "Komentar berhasil dihapus" }
  })