import { Elysia, t } from "elysia"
import { prisma } from "../index"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"

// Membaca variabel dari file .env
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

export const authRoutes = new Elysia({ prefix: "/auth" })
  // ✨ PENYEMPURNAAN GLOBAL: Mengatasi masalah "Do not know how to serialize a BigInt"
  .mapResponse(({ response, set }) => {
    if (response && typeof response === "object") {
      const stringified = JSON.parse(
        JSON.stringify(response, (_, v) => (typeof v === "bigint" ? v.toString() : v))
      )
      return stringified
    }
    return response
  })

  // ====== GET /auth/google (RUTE TAMBAHAN: REDIRECT KE GOOGLE) ======
  .get("/google", ({ set }) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
    
    const options = {
      redirect_uri: GOOGLE_REDIRECT_URI!,
      client_id: GOOGLE_CLIENT_ID!,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    }

    const qs = new URLSearchParams(options)
    set.redirect = `${rootUrl}?${qs.toString()}`
  })

  // ====== GET /auth/google/callback (RUTE TAMBAHAN: PROSES DATA GOOGLE) ======
  .get("/google/callback", async ({ query, set }) => {
    const { code } = query

    if (!code) {
      set.redirect = "http://localhost:5173/login?error=Google auth failed"
      return
    }

    try {
      // 1. Tukar code dari Google menjadi Access Token resmi
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET!,
          redirect_uri: GOOGLE_REDIRECT_URI!,
          grant_type: "authorization_code",
        }),
      })

      const tokenData = await tokenResponse.json() as any
      
      // 2. Ambil data profil/email user dari Google API
      const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
      const googleUser = await userResponse.json() as any

      const baseUsername = googleUser.email.split("@")[0]

      // 3. Cari user berdasarkan email, jika belum ada otomatis dibuat (Upsert)
      const user = await prisma.user.upsert({
        where: { email: googleUser.email },
        update: {
          name: googleUser.name,
          avatar_url: googleUser.picture,
        },
        create: {
          name: googleUser.name,
          email: googleUser.email,
          username: `${baseUsername}_gg`, 
          provider: "google",
        },
      })

      // 4. Generate JWT Token internal aplikasi Anda (Aktif 7 hari)
      const appToken = jwt.sign(
        { id: user.id.toString() },
        JWT_SECRET,
        { expiresIn: "7d" }
      )

      // 5. Lempar balik ke frontend dengan parameter yang cocok dengan useEffect LoginPage.tsx Anda
      const frontendUrl = `http://localhost:5173/login?token=${appToken}&id=${user.id.toString()}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&avatarUrl=${encodeURIComponent(user.avatar_url || "")}&username=${user.username}`
      
      set.redirect = frontendUrl
    } catch (error) {
      console.error("Google Auth Error:", error)
      set.redirect = "http://localhost:5173/login?error=Server error"
    }
  })

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

  // ====== GET /auth/me ======
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

        // ✨ DIPERBAIKI: Eksplisit memetakan field untuk menghindari crash BigInt JSON
        return {
          id: user.id.toString(),
          name: user.name,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
        }
      } catch (e) {
        set.status = 401
        return { error: "Token tidak valid atau sudah expired" }
      }
    }
  )