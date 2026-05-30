import { Elysia } from "elysia"
import { prisma } from "../db"
import jwt from "jsonwebtoken"

/**
 * OAuth Google Routes (tanpa library eksternal)
 * Menggunakan Google OAuth 2.0 flow manual via redirect + token exchange.
 */
export const oauthRoutes = new Elysia({ prefix: "/auth" })

  // ====== GET /auth/google ======
  // Redirect user ke halaman consent Google
  .get("/google", ({ redirect, query }) => {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/callback"

    if (!GOOGLE_CLIENT_ID) {
      return { error: "Google OAuth belum dikonfigurasi" }
    }

    // State untuk mencegah CSRF, bisa berupa random string di produksi
    const state = query.state || "default"

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      state,
      prompt: "select_account",
    })

    return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
  })

  // ====== GET /auth/callback ======
  // Google callback: tukar authorization code → access token → user info → JWT
  .get("/callback", async ({ query, set, redirect }) => {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/callback"
    const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

    const { code, error } = query

    if (error || !code) {
      return redirect(`${FRONTEND_URL}/login?error=oauth_denied`)
    }

    try {
      // 1. Tukar code dengan access token
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET!,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      })

      if (!tokenRes.ok) {
        console.error("Token exchange failed:", await tokenRes.text())
        return redirect(`${FRONTEND_URL}/login?error=token_exchange_failed`)
      }

      const tokenData = await tokenRes.json() as { access_token: string }

      // 2. Ambil info user dari Google
      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })

      if (!userRes.ok) {
        return redirect(`${FRONTEND_URL}/login?error=userinfo_failed`)
      }

      const googleUser = await userRes.json() as {
        id: string
        email: string
        name: string
        picture: string
        verified_email: boolean
      }

      if (!googleUser.email) {
        return redirect(`${FRONTEND_URL}/login?error=no_email`)
      }

      // 3. Cari atau buat user di database
      let user = await prisma.user.findUnique({ where: { email: googleUser.email } })

      if (!user) {
        // Buat username unik dari nama Google
        const baseUsername = googleUser.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_")
          .slice(0, 20)
        
        let username = baseUsername
        let counter = 1
        while (await prisma.user.findUnique({ where: { username } })) {
          username = `${baseUsername}${counter++}`
        }

        user = await prisma.user.create({
          data: {
            name: googleUser.name,
            username,
            email: googleUser.email,
            avatar_url: googleUser.picture || null,
            provider: "google",
            provider_id: googleUser.id,
            email_verified_at: googleUser.verified_email ? new Date() : null,
          },
        })
      } else if (user.provider !== "google") {
        // User sudah ada dengan email yang sama tapi bukan Google provider
        // Update provider_id-nya saja
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider_id: googleUser.id,
            avatar_url: user.avatar_url || googleUser.picture || null,
          },
        })
      }

      // 4. Buat JWT token
      const token = jwt.sign({ id: user.id.toString() }, JWT_SECRET, { expiresIn: "7d" })

      // 5. Redirect ke frontend dengan token di query param
      // Frontend akan ambil token ini dan simpan ke localStorage
      const userPayload = encodeURIComponent(JSON.stringify({
        id: user.id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
      }))

      return redirect(`${FRONTEND_URL}/oauth/callback?token=${token}&user=${userPayload}`)

    } catch (err) {
      console.error("OAuth callback error:", err)
      return redirect(`${FRONTEND_URL}/login?error=server_error`)
    }
  })
