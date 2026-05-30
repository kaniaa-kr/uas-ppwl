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
    if (!email || !password) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Gagal login")
      }
      const data = await res.json()
      setAuth(data.user, data.token)
      toast.success(`Selamat Datang, ${data.user.name || data.user.username}! 👋`)
      navigate("/")
    } catch (error: any) {
      toast.error(error.message || "Gagal login")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && email && password) handleLogin()
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-[350px] bg-white border border-[#dbdbdb] px-10 py-10 flex flex-col items-center mb-[10px]">
        {/* Logo */}
        <h1
          className="text-[#262626] mb-8 select-none"
          style={{
            fontFamily: "Billabong, 'Grand Hotel', cursive, Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "2.8rem",
            lineHeight: 1,
          }}
        >
          Instagram
        </h1>

        {/* Form */}
        <div className="w-full flex flex-col gap-[6px]">
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Nomor telepon, nama pengguna, atau email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-[9px] pb-[7px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
            />
          </div>
          <div className="relative w-full">
            <input
              type="password"
              placeholder="Kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-[9px] pb-[7px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full mt-3 bg-[#0095f6] hover:bg-[#1877f2] text-white text-[13px] font-semibold py-[7px] rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Sedang masuk..." : "Masuk"}
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 mt-4 mb-[18px]">
          <div className="flex-1 h-px bg-[#dbdbdb]" />
          <span className="text-[13px] font-semibold text-[#737373] tracking-widest">ATAU</span>
          <div className="flex-1 h-px bg-[#dbdbdb]" />
        </div>

        {/* Forgot password */}
        <Link
          to="#"
          className="text-xs text-[#00376b] hover:text-[#262626] transition-colors mt-3"
        >
          Lupa kata sandi?
        </Link>
      </div>

      {/* Register link */}
      <div className="w-full max-w-[350px] bg-white border border-[#dbdbdb] py-5 flex items-center justify-center">
        <p className="text-[14px] text-[#262626] m-4 text-center">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-[#0095f6] font-semibold hover:text-[#00376b] transition-colors"
          >
            Buat akun
          </Link>
        </p>
      </div>

      {/* App download hint */}
      <p className="mt-5 text-[14px] text-[#262626]">Dapatkan aplikasinya.</p>
    </div>
  )
}
