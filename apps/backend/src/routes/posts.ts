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

export const postRoutes = new Elysia({ prefix: "/posts" })

  // ====== GET /posts ======
  .get("/", async ({ query }) => {
    const where = (query as any).username
      ? { user: { username: (query as any).username } }
      : {}

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, username: true, avatar_url: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { created_at: "desc" },
    })

    return posts.map((p) => ({
      ...p,
      id: p.id.toString(),
      user_id: p.user_id.toString(),
      user: p.user ? { ...p.user, id: p.user.id.toString() } : null,
    }))
  })

  // ====== GET /posts/:id ======
  .get("/:id", async ({ params, set }) => {
    const post = await prisma.post.findUnique({
      where: { id: BigInt(params.id) },
      include: {
        user: { select: { id: true, name: true, username: true, avatar_url: true } },
        _count: { select: { likes: true, comments: true } },
      },
    })

    if (!post) {
      set.status = 404
      return { error: "Post tidak ditemukan" }
    }

    return {
      ...post,
      id: post.id.toString(),
      user_id: post.user_id.toString(),
      user: post.user ? { ...post.user, id: post.user.id.toString() } : null,
    }
  })

  // ====== POST /posts ======
  .post(
    "/",
    async ({ body, headers, set }) => {
      const decoded = getUserFromToken(headers.authorization)
      if (!decoded) { set.status = 401; return { error: "Unauthorized" } }

      const userExists = await prisma.user.findUnique({ where: { id: BigInt(decoded.id) } })
      if (!userExists) {
        set.status = 401
        return { error: "Sesi tidak valid atau user telah dihapus. Silakan login kembali." }
      }
      
      const { content, image_url } = body
      if (!image_url || !image_url.trim()) { set.status = 400; return { error: "Gambar wajib disertakan" } }

      const post = await prisma.post.create({
        data: {
          content,
          image_url: image_url ?? null,
          user_id: BigInt(decoded.id),
        },
        include: {
          user: { select: { id: true, name: true, username: true, avatar_url: true } },
          _count: { select: { likes: true, comments: true } },
        },
      })

      return {
        ...post,
        id: post.id.toString(),
        user_id: post.user_id.toString(),
        user: post.user ? { ...post.user, id: post.user.id.toString() } : null,
      }
    },
    {
      body: t.Object({
        content: t.String({ minLength: 1 }),
        image_url: t.String({ minLength: 1 }), 
      }),
    }
  )

  // ====== DELETE /posts/:id ======
  .delete("/:id", async ({ params, headers, set }) => {
    const decoded = getUserFromToken(headers.authorization)
    if (!decoded) { set.status = 401; return { error: "Unauthorized" } }

    const post = await prisma.post.findUnique({ where: { id: BigInt(params.id) } })
    if (!post) { set.status = 404; return { error: "Post tidak ditemukan" } }

    if (post.user_id.toString() !== decoded.id) { set.status = 403; return { error: "Forbidden" } }

    await prisma.post.delete({ where: { id: BigInt(params.id) } })
    return { message: "Post berhasil dihapus" }
  })

  // ====== PUT /posts/:id ======
  .put(
    "/:id",
    async ({ params, body, headers, set }) => {
      const decoded = getUserFromToken(headers.authorization)
      if (!decoded) { set.status = 401; return { error: "Unauthorized" } }

      const post = await prisma.post.findUnique({ where: { id: BigInt(params.id) } })
      if (!post) { set.status = 404; return { error: "Post tidak ditemukan" } }

      if (post.user_id.toString() !== decoded.id) { set.status = 403; return { error: "Forbidden" } }

      const { content, image_url } = body
      const updated = await prisma.post.update({
        where: { id: BigInt(params.id) },
        data: { content, image_url: image_url ?? post.image_url },
        include: {
          user: { select: { id: true, name: true, username: true, avatar_url: true } },
          _count: { select: { likes: true, comments: true } },
        },
      })

      return {
        ...updated,
        id: updated.id.toString(),
        user_id: updated.user_id.toString(),
        user: updated.user ? { ...updated.user, id: updated.user.id.toString() } : null,
      }
    },
    {
      body: t.Object({
        content: t.String({ minLength: 1 }),
        image_url: t.Optional(t.Nullable(t.String())),
      }),
    }
  )

  // ====== POST /posts/:id/like ======
  .post("/:id/like", async ({ params, headers, set }) => {
    const decoded = getUserFromToken(headers.authorization)
    if (!decoded) { set.status = 401; return { error: "Unauthorized" } }

    // 🚨 Proteksi jika user pencet like tapi akunnya sebenarnya sudah kehapus di DB
    const userExists = await prisma.user.findUnique({ where: { id: BigInt(decoded.id) } })
    if (!userExists) { set.status = 401; return { error: "User tidak valid" } }

    const postId = BigInt(params.id)
    const userId = BigInt(decoded.id)

    const existing = await prisma.postLike.findUnique({
      where: { post_id_user_id: { post_id: postId, user_id: userId } },
    })

    if (existing) {
      await prisma.postLike.delete({
        where: { post_id_user_id: { post_id: postId, user_id: userId } },
      })
      return { liked: false }
    }

    await prisma.postLike.create({ data: { post_id: postId, user_id: userId } })
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (post && post.user_id.toString() !== decoded.id) {
      await prisma.notification.create({
        data: { user_id: post.user_id, actor_id: userId, type: "like", post_id: postId },
      }).catch(() => {})
    }

    return { liked: true }
  })