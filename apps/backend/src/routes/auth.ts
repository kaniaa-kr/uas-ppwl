import { Elysia, t } from "elysia"
import { prisma } from "../index"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"

export const authRoutes = new Elysia({ prefix: "/auth" })

  // ====== POST /auth/register ======
  .post(
    "/register",
    async ({ body, set }) => {
      const { name, username, email, password } = body

      // Validasi: email sudah ada?
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      })
      if (existingEmail) {
        set.status = 400
        return { error: "Email sudah terdaftar" }
      }

      // Validasi: username sudah ada?
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      })
      if (existingUsername) {
        set.status = 400
        return { error: "Username sudah dipakai" }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Buat user baru
      const user = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          provider: "email",
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          avatar_url: true,
        },
      })

      // Generate JWT
      const token = jwt.sign(
        { id: user.id.toString() },
        JWT_SECRET,
        { expiresIn: "7d" }
      )

      return {
        message: "Register berhasil",
        user: {
          ...user,
          id: user.id.toString(),
        },
        accessToken: token,
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2 }),
        username: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
      }),
    }
  )

  // ====== POST /auth/login ======
  .post(
    "/login",
    async ({ body, set }) => {
      const { email, password } = body

      // Cari user
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user || !user.password) {
        set.status = 401
        return { error: "Email atau password salah" }
      }

      // Validasi password
      const passwordValid = await bcrypt.compare(password, user.password)
      if (!passwordValid) {
        set.status = 401
        return { error: "Email atau password salah" }
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id.toString() },
        JWT_SECRET,
        { expiresIn: "7d" }
      )

      return {
        message: "Login berhasil",
        user: {
          id: user.id.toString(),
          name: user.name,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
        },
        accessToken: token,
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
      }),
    }
  )

  // ====== GET /auth/me (Optional, verify token) ======
  .get(
    "/me",
    async ({ headers, set }) => {
      const auth = headers.authorization
      if (!auth) {
        set.status = 401
        return { error: "Tidak ada token" }
      }

      try {
        const token = auth.replace("Bearer ", "")
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

        const user = await prisma.user.findUnique({
          where: { id: BigInt(decoded.id) },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar_url: true,
          },
        })

        if (!user) {
          set.status = 404
          return { error: "User tidak ditemukan" }
        }

        return { ...user, id: user.id.toString() }
      } catch (e) {
        set.status = 401
        return { error: "Token tidak valid atau sudah expired" }
      }
    }
  )