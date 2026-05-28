import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email dan password wajib diisi")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Login gagal")
        return
      }

      setAuth(data.user, data.accessToken)
      toast.success(`Selamat Datang, ${data.user.name}! 👋`)
      navigate("/")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Terjadi kesalahan, coba lagi")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-[350px] bg-white border border-[#dbdbdb] px-10 py-10 flex flex-col items-center">
        {/* Logo */}
        <h1
          className="text-[#262626] mb-8 select-none"
          style={{
            fontFamily: "Billabong, Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "2.4rem",
            lineHeight: 1,
          }}
        >
          Instagram
        </h1>

        {/* Form */}
        <div className="w-full flex flex-col gap-[6px]">
          <input
            type="email"
            placeholder="Nomor telepon, nama pengguna, atau email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-3 py-[9px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />
          <input
            type="password"
            placeholder="Kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-3 py-[9px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full mt-2 bg-[#0095f6] text-white text-sm font-semibold py-[7px] rounded-lg disabled:opacity-40 transition-opacity"
          >
            {loading ? "Sedang masuk..." : "Masuk"}
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-[#dbdbdb]" />
          <span className="text-xs font-semibold text-[#8e8e8e] tracking-widest">ATAU</span>
          <div className="flex-1 h-px bg-[#dbdbdb]" />
        </div>

        {/* Forgot password */}
        <Link
          to="/forgot-password"
          className="text-xs text-[#00376b] hover:text-[#262626] transition-colors"
        >
          Lupa kata sandi?
        </Link>
      </div>

      {/* Register link */}
      <div className="w-full max-w-[350px] mt-2.5 bg-white border border-[#dbdbdb] px-10 py-5 flex items-center justify-center">
        <p className="text-sm text-[#262626]">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-[#0095f6] font-semibold hover:text-[#00376b] transition-colors"
          >
            Daftar
          </Link>
        </p>
      </div>

      {/* App download hint */}
      <p className="mt-4 text-sm text-[#262626]">Dapatkan aplikasinya.</p>
    </div>
  )
}
