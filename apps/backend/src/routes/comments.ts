import { Elysia, t } from "elysia"
import { prisma } from "../index"
import { authMiddleware } from "../middleware/auth.middleware"

import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"


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
        user: {
          select: { id: true, name: true, username: true, avatar_url: true },
        },
        // BUG FIX #2: Hitung likes komentar
        _count: { select: { likes: true } },
      },
      orderBy: { created_at: "asc" },
    })

    return comments.map((c) => ({
      ...c,
      id: c.id.toString(),
      post_id: c.post_id.toString(),
      user_id: c.user_id.toString(),
      // BUG FIX #2: parent_id harus ikut di-serialize
      parent_id: c.parent_id ? c.parent_id.toString() : null,
      likes_count: c._count.likes,
      user: { ...c.user, id: c.user.id.toString() },
    }))
  })

  // ====== POST /comments ======
  // BUG FIX #1: Route untuk menambah komentar (sebelumnya tidak ada!)
  .post(
    "/",
    async ({ body, set, request }) => {
      // Ambil token dari header Authorization
      const authHeader = request.headers.get("authorization")
      if (!authHeader) {
        set.status = 401
        return { error: "Unauthorized" }
      }
      const token = authHeader.replace("Bearer ", "")

      // Verifikasi token — sesuaikan dengan cara auth kamu
      let decoded: { id: string }

      try {
        decoded = jwt.verify(token, JWT_SECRET) as { id: string }
      } catch {
        set.status = 401
        return { error: "Token tidak valid" }
      }

      const user = await prisma.user.findUnique({
        where: { id: BigInt(decoded.id) },
      })

      if (!user) {
        set.status = 401
        return { error: "User tidak ditemukan" }
      }


      const postId = BigInt(body.post_id)
      const post = await prisma.post.findUnique({ where: { id: postId } })
      if (!post) {
        set.status = 404
        return { error: "Post tidak ditemukan" }
      }

      const comment = await prisma.comment.create({
        data: {
          content: body.content,
          post_id: postId,
          user_id: user.id,
          // parent_id untuk reply — null kalau komentar biasa
          parent_id: body.parent_id ? BigInt(body.parent_id) : null,
        },
        include: {
          user: {
            select: { id: true, name: true, username: true, avatar_url: true },
          },
          _count: { select: { likes: true } },
        },
      })

      set.status = 201
      return {
        ...comment,
        id: comment.id.toString(),
        post_id: comment.post_id.toString(),
        user_id: comment.user_id.toString(),
        parent_id: comment.parent_id ? comment.parent_id.toString() : null,
        likes_count: comment._count.likes,
        user: { ...comment.user, id: comment.user.id.toString() },
      }
    },
    {
      body: t.Object({
        post_id: t.String(),
        content: t.String({ minLength: 1 }),
        parent_id: t.Optional(t.Nullable(t.String())),
      }),
    }
  )

  // ====== POST /comments/:commentId/like ======
  // BUG FIX #3: Route untuk like/unlike komentar
  .post("/:commentId/like", async ({ params, set, request }) => {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      set.status = 401
      return { error: "Unauthorized" }
    }
    const token = authHeader.replace("Bearer ", "")

    let decoded: { id: string }

    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    } catch {
      set.status = 401
      return { error: "Token tidak valid" }
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.id) },
    })

    if (!user) {
      set.status = 401
      return { error: "User tidak ditemukan" }
    }


    const commentId = BigInt(params.commentId)

    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment) {
      set.status = 404
      return { error: "Komentar tidak ditemukan" }
    }

    // Cek apakah sudah like
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        user_id_comment_id: {
          user_id: user.id,
          comment_id: commentId,
        },
      },
    })

    if (existingLike) {
      // Sudah like → unlike
      await prisma.commentLike.delete({
        where: {
          user_id_comment_id: {
            user_id: user.id,
            comment_id: commentId,
          },
        },
      })
      const count = await prisma.commentLike.count({ where: { comment_id: commentId } })
      return { liked: false, likes_count: count }
    } else {
      // Belum like → like
      await prisma.commentLike.create({
        data: { user_id: user.id, comment_id: commentId },
      })
      const count = await prisma.commentLike.count({ where: { comment_id: commentId } })
      return { liked: true, likes_count: count }
    }
  })

    // ====== DELETE /comments/:commentId ======
  .delete("/:commentId", async ({ params, request, set }) => {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      set.status = 401
      return { error: "Unauthorized" }
    }

    const token = authHeader.replace("Bearer ", "")

    let decoded: { id: string }

    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    } catch {
      set.status = 401
      return { error: "Token tidak valid" }
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.id) },
    })

    if (!user) {
      set.status = 401
      return { error: "User tidak ditemukan" }
    }

    const commentId = BigInt(params.commentId)

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      set.status = 404
      return { error: "Komentar tidak ditemukan" }
    }

    // hanya pemilik komentar yang boleh hapus
    if (comment.user_id.toString() !== user.id.toString()) {
      set.status = 403
      return { error: "Tidak punya akses" }
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    return {
      success: true,
      message: "Komentar berhasil dihapus",
    }
  })