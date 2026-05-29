import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Username dan password wajib diisi")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Login gagal")
      }
      const data = await res.json()
      setAuth(data.user, data.token)
      navigate("/")
    } catch (e: any) {
      toast.error(e.message || "Login gagal")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full bg-[#121212] border border-[#363636] rounded-lg px-4 py-3 text-[14px] text-white placeholder-[#6b6b6b] outline-none focus:border-[#737373] transition-colors"

  return (
    <div className="min-h-screen bg-black flex">
      {/* ── LEFT HERO (desktop only) ──────────────────────────── */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center px-12 bg-black">
        {/* Phone mockup placeholder */}
        <div className="w-[260px] h-[420px] rounded-[36px] bg-[#1a1a1a] border border-[#363636] mb-12 flex items-center justify-center shadow-2xl">
          <div className="flex flex-col gap-3 px-4 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-3">
                <div className="w-8 h-8 rounded-full bg-[#363636]" />
                <div className="flex flex-col gap-1 flex-1">
                  <div className="h-2 bg-[#363636] rounded-full w-20" />
                  <div className="h-2 bg-[#262626] rounded-full w-32" />
                </div>
              </div>
            ))}
            <div className="w-full aspect-square rounded-lg bg-[#262626] mt-1" />
            <div className="flex gap-3 px-3">
              <div className="w-5 h-5 rounded-full bg-[#363636]" />
              <div className="w-5 h-5 rounded-full bg-[#363636]" />
              <div className="w-5 h-5 rounded-full bg-[#363636]" />
            </div>
          </div>
        </div>

        {/* Hero text */}
        <h1 className="text-white text-3xl font-semibold text-center leading-tight max-w-[340px]">
          Lihat momen sehari-hari dari{" "}
          <span className="text-[#0095f6]">teman terdekatmu.</span>
        </h1>
      </div>

      {/* ── RIGHT FORM ────────────────────────────────────────── */}
      <div className="flex-1 md:flex-none md:w-[400px] flex flex-col items-center justify-center px-6 bg-black">
        <div className="w-full max-w-[380px]">
          {/* Card */}
          <div className="bg-[#1a1a1a] border border-[#363636] rounded-2xl px-8 py-10 mb-4">
            {/* Logo */}
            <h1
              className="text-white text-center mb-8 leading-none"
              style={{
                fontFamily: "Billabong, 'Grand Hotel', cursive",
                fontStyle: "italic",
                fontSize: "3rem",
              }}
            >
              Insuta
            </h1>

            {/* Form */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className={inputClass}
                autoComplete="username"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={inputClass + " pr-12"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading || !username.trim() || !password.trim()}
                className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Masuk...
                  </span>
                ) : (
                  "Masuk"
                )}
              </button>
            </div>
          </div>

          {/* Register link */}
          <div className="bg-[#1a1a1a] border border-[#363636] rounded-2xl px-8 py-5 text-center">
            <p className="text-[14px] text-[#a0a0a0]">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-[#0095f6] font-semibold hover:text-[#1877f2] transition-colors"
              >
                Daftar
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[#4a4a4a] text-[11px]">
              <a href="#" className="hover:text-[#737373] transition-colors">Tentang</a>
              <span>·</span>
              <a href="#" className="hover:text-[#737373] transition-colors">Bantuan</a>
              <span>·</span>
              <a href="#" className="hover:text-[#737373] transition-colors">Privasi</a>
              <span>·</span>
              <a href="#" className="hover:text-[#737373] transition-colors">Ketentuan</a>
            </div>
            <p className="text-[#4a4a4a] text-[11px] mt-2 uppercase tracking-wider">
              © 2026 Insuta
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
