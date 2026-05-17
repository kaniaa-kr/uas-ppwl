import { Elysia } from "elysia"
import { prisma } from "../index"

export const commentRoutes = new Elysia({ prefix: "/comments" })

  // ====== GET /comments/post/:postId ======
  // Ambil semua komentar untuk 1 postingan
  .get("/post/:postId", async ({ params, set }) => {
    const postId = BigInt(params.postId)

    // Validasi: post ada?
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })
    if (!post) {
      set.status = 404
      return { error: "Post tidak ditemukan" }
    }

    // Ambil comments
    const comments = await prisma.comment.findMany({
      where: { post_id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { created_at: "asc" },
    })

    return comments.map((c) => ({
      ...c,
      id: c.id.toString(),
      post_id: c.post_id.toString(),
      user_id: c.user_id.toString(),
      user: {
        ...c.user,
        id: c.user.id.toString(),
      },
    }))
  })