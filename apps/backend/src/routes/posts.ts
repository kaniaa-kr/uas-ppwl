import { Elysia } from "elysia"
import { prisma } from "../index" // Mengimpor instance Prisma dari entry point utama

export const postRoutes = new Elysia({ prefix: "/posts" })
  // Endpoint GET /posts - Menampilkan semua postingan untuk beranda
  .get("/", async () => {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { created_at: "desc" }, // Mengurutkan dari postingan paling baru
        include: {
          user: {
            select: { id: true, name: true, username: true, avatar_url: true }
          },
          _count: {
            select: { likes: true, comments: true }
          }
        }
      })

      return { success: true, data: posts }
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Gagal mengambil data beranda",
          error: String(error)
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }
  })

  // Endpoint GET /posts/:id - Menampilkan detail spesifik 1 postingan
  .get("/:id", async ({ params: { id } }) => {
    try {
      const post = await prisma.post.findUnique({
        where: { id: String(id) },
        include: {
          user: {
            select: { id: true, name: true, username: true, avatar_url: true }
          },
          _count: {
            select: { likes: true, comments: true }
          }
        }
      })

      if (!post) {
        return new Response(
          JSON.stringify({ success: false, message: "Postingan tidak ditemukan" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        )
      }

      return { success: true, data: post }
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Terjadi kesalahan pada server" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }
  })