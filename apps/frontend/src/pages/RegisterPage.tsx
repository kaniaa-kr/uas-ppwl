import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async () => {
    if (!form.name || !form.username || !form.email || !form.password) {
      toast.error("Semua field wajib diisi")
      return
    }

    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Registrasi gagal")
        return
      }

      setAuth(data.user, data.accessToken)
      toast.success(
        `Akun berhasil dibuat! Selamat datang, ${data.user.name}! 🎉`
      )
      navigate("/")
    } catch (error) {
      console.error("Register error:", error)
      toast.error("Terjadi kesalahan, coba lagi")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister()
  }

  const allFilled = form.name && form.username && form.email && form.password

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-[350px] bg-white border border-[#dbdbdb] px-10 py-10 flex flex-col items-center">
        {/* Logo */}
        <h1
          className="text-[#262626] mb-4 select-none"
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

        {/* Tagline */}
        <p className="text-[#737373] font-semibold text-center text-base leading-snug mb-6 px-2">
          Daftar untuk melihat foto dan video dari teman-temanmu.
        </p>

        {/* Form */}
        <div className="w-full flex flex-col gap-[6px]">
          <input
            name="email"
            type="email"
            placeholder="Nomor telepon atau email"
            value={form.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-3 py-[9px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />
          <input
            name="name"
            type="text"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-3 py-[9px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />
          <input
            name="username"
            type="text"
            placeholder="Nama pengguna"
            value={form.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-3 py-[9px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Kata sandi"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-3 py-[9px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />

          {/* Terms notice */}
          <p className="text-[10px] text-[#737373] text-center mt-2 leading-relaxed">
            Dengan mendaftar, kamu menyetujui{" "}
            <span className="font-semibold text-[#262626]">Ketentuan</span>,{" "}
            <span className="font-semibold text-[#262626]">Kebijakan Privasi</span>, dan{" "}
            <span className="font-semibold text-[#262626]">Kebijakan Cookie</span> kami.
          </p>

          <button
            onClick={handleRegister}
            disabled={loading || !allFilled}
            className="w-full mt-2 bg-[#0095f6] text-white text-sm font-semibold py-[7px] rounded-lg disabled:opacity-40 transition-opacity"
          >
            {loading ? "Sedang mendaftar..." : "Daftar"}
          </button>
        </div>
      </div>

      {/* Login link */}
      <div className="w-full max-w-[350px] mt-2.5 bg-white border border-[#dbdbdb] px-10 py-5 flex items-center justify-center">
        <p className="text-sm text-[#262626]">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-[#0095f6] font-semibold hover:text-[#00376b] transition-colors"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
