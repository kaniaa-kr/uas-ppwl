import { Elysia } from "elysia"
import { prisma } from "../index"

export const postRoutes = new Elysia({ prefix: "/posts" })

  // ====== GET /posts ======
  // Ambil semua postingan untuk halaman beranda
  .get("/", async () => {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar_url: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 20,
    })

    // Convert BigInt ke string agar bisa di-JSON-kan
    return posts.map((p) => ({
      ...p,
      id: p.id.toString(),
      user_id: p.user_id.toString(),
      user: {
        ...p.user,
        id: p.user.id.toString(),
      },
    }))
  })

  // ====== GET /posts/:id ======
  // Ambil detail 1 postingan
  .get("/:id", async ({ params, set }) => {
    const post = await prisma.post.findUnique({
      where: { id: BigInt(params.id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar_url: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
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
      user: {
        ...post.user,
        id: post.user.id.toString(),
      },
    }
  })