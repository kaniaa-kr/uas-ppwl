import { Elysia, t } from "elysia"
import { prisma } from "../db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const authRoutes = new Elysia({ prefix: "/auth" })

  // ====== POST /auth/register ======
  .post(
    "/register",
    async ({ body, set }) => {
      const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"
      const { name, username, email, password } = body

      const existingEmail = await prisma.user.findUnique({ where: { email } })
      if (existingEmail) {
        set.status = 400
        return { error: "Email sudah terdaftar" }
      }

      const existingUsername = await prisma.user.findUnique({ where: { username } })
      if (existingUsername) {
        set.status = 400
        return { error: "Username sudah dipakai" }
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: { name, username, email, password: hashedPassword, provider: "email" },
        select: { id: true, name: true, username: true, email: true, avatar_url: true },
      })

      const token = jwt.sign({ id: user.id.toString() }, JWT_SECRET, { expiresIn: "7d" })
      return {
        message: "Register berhasil",
        user: { ...user, id: user.id.toString() },
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
      const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"
      const { email, password } = body

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || !user.password) {
        set.status = 401
        return { error: "Email atau password salah" }
      }

      const passwordValid = await bcrypt.compare(password, user.password)
      if (!passwordValid) {
        set.status = 401
        return { error: "Email atau password salah" }
      }

      const token = jwt.sign({ id: user.id.toString() }, JWT_SECRET, { expiresIn: "7d" })
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

  // ====== GET /auth/me ======
  .get("/me", async ({ headers, set }) => {
    const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"
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
        select: { id: true, name: true, username: true, email: true, avatar_url: true },
      })

      if (!user) {
        set.status = 401
        return { error: "User sudah tidak ada di database, silakan login ulang" }
      }

      return { ...user, id: user.id.toString() }
    } catch {
      set.status = 401
      return { error: "Token tidak valid atau sudah expired" }
    }
  })

  // ====== PUT /auth/profile ======
  .put(
    "/profile",
    async ({ body, headers, set }) => {
      const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"
      const auth = headers.authorization
      if (!auth) { set.status = 401; return { error: "Unauthorized" } }

      let decoded: { id: string }
      try {
        const token = auth.replace("Bearer ", "")
        decoded = jwt.verify(token, JWT_SECRET) as { id: string }
      } catch {
        set.status = 401
        return { error: "Token tidak valid" }
      }

      // Pastikan user masih ada
      const userExists = await prisma.user.findUnique({ where: { id: BigInt(decoded.id) } })
      if (!userExists) { set.status = 401; return { error: "User tidak ditemukan" } }

      const { name, email, bio, avatar_url } = body

      if (email) {
        const existing = await prisma.user.findFirst({
          where: { email, NOT: { id: BigInt(decoded.id) } },
        })
        if (existing) {
          set.status = 400
          return { error: "Email sudah dipakai akun lain" }
        }
      }

      const updated = await prisma.user.update({
        where: { id: BigInt(decoded.id) },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(bio !== undefined && { bio }),
          ...(avatar_url !== undefined && { avatar_url }),
        },
        select: { id: true, name: true, username: true, email: true, avatar_url: true, bio: true },
      })

      return { ...updated, id: updated.id.toString() }
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 2 })),
        email: t.Optional(t.String({ format: "email" })),
        bio: t.Optional(t.Nullable(t.String())),
        avatar_url: t.Optional(t.Nullable(t.String())),
      }),
    }
  )

  // ====== PUT /auth/password ======
  .put(
    "/password",
    async ({ body, headers, set }) => {
      const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"
      const auth = headers.authorization
      if (!auth) { set.status = 401; return { error: "Unauthorized" } }

      let decoded: { id: string }
      try {
        const token = auth.replace("Bearer ", "")
        decoded = jwt.verify(token, JWT_SECRET) as { id: string }
      } catch {
        set.status = 401
        return { error: "Token tidak valid" }
      }

      const { old_password, new_password } = body

      const user = await prisma.user.findUnique({ where: { id: BigInt(decoded.id) } })
      if (!user || !user.password) {
        set.status = 400
        return { error: "Akun tidak ditemukan atau tidak menggunakan password" }
      }

      const valid = await bcrypt.compare(old_password, user.password)
      if (!valid) {
        set.status = 400
        return { error: "Password lama salah" }
      }

      const hashed = await bcrypt.hash(new_password, 10)
      await prisma.user.update({
        where: { id: BigInt(decoded.id) },
        data: { password: hashed },
      })

      return { message: "Password berhasil diubah" }
    },
    {
      body: t.Object({
        old_password: t.String({ minLength: 1 }),
        new_password: t.String({ minLength: 6 }),
      }),
    }
  )

  // ====== GET /auth/profile/:username ======
  .get("/profile/:username", async ({ params, set }) => {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: { id: true, name: true, username: true, avatar_url: true, bio: true },
    })

    if (!user) {
      set.status = 404
      return { error: "User tidak ditemukan" }
    }

    return { ...user, id: user.id.toString() }
  })