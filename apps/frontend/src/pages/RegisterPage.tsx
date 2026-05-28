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
  
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async () => {
    if (!form.name || !form.username || !form.email || !form.password) {
      toast.error("Semua field wajib diisi")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Gagal mendaftar")
      }
      toast.success("Registrasi berhasil, silakan login")
      navigate("/login")
    } catch (error: any) {
      toast.error(error.message || "Gagal mendaftar")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister()
  }

  const allFilled = form.name && form.username && form.email && form.password

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4 py-8">
      {/* Card */}
      <div className="w-full max-w-[350px] bg-white border border-[#dbdbdb] px-10 pt-10 pb-8 flex flex-col items-center mb-[10px]">
        {/* Logo */}
        <h1
          className="text-[#262626] mb-4 select-none"
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

        {/* Tagline */}
        <p className="text-[#737373] font-semibold text-center text-[16px] leading-[20px] mb-4">
          Daftar untuk melihat foto dan video dari teman-temanmu.
        </p>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 mt-2 mb-4">
          <div className="flex-1 h-px bg-[#dbdbdb]" />
          <span className="text-[13px] font-semibold text-[#737373] tracking-widest">ATAU</span>
          <div className="flex-1 h-px bg-[#dbdbdb]" />
        </div>

        {/* Form */}
        <div className="w-full flex flex-col gap-[6px]">
          <input
            name="email"
            type="email"
            placeholder="Nomor telepon atau email"
            value={form.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-[9px] pb-[7px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />
          <input
            name="name"
            type="text"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-[9px] pb-[7px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />
          <input
            name="username"
            type="text"
            placeholder="Nama pengguna"
            value={form.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-[9px] pb-[7px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Kata sandi"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2 pt-[9px] pb-[7px] text-xs text-[#262626] placeholder-[#8e8e8e] outline-none focus:border-[#a8a8a8] transition-colors"
          />

          {/* Terms notice */}
          <p className="text-[12px] text-[#737373] text-center mt-3 leading-[16px] mb-2">
            Dengan mendaftar, kamu menyetujui{" "}
            <span className="font-semibold text-[#00376b]">Ketentuan</span>,{" "}
            <span className="font-semibold text-[#00376b]">Kebijakan Privasi</span>, dan{" "}
            <span className="font-semibold text-[#00376b]">Kebijakan Cookie</span> kami.
          </p>

          <button
            onClick={handleRegister}
            disabled={loading || !allFilled}
            className="w-full mt-2 bg-[#0095f6] hover:bg-[#1877f2] text-white text-[13px] font-semibold py-[7px] rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Sedang mendaftar..." : "Daftar"}
          </button>
        </div>
      </div>

      {/* Login link */}
      <div className="w-full max-w-[350px] bg-white border border-[#dbdbdb] py-5 flex items-center justify-center">
        <p className="text-[14px] text-[#262626] m-4 text-center">
          Punya akun?{" "}
          <Link
            to="/login"
            className="text-[#0095f6] font-semibold hover:text-[#00376b] transition-colors"
          >
            Masuk
          </Link>
        </p>
      </div>

      {/* App download hint */}
      <p className="mt-5 text-[14px] text-[#262626]">Dapatkan aplikasinya.</p>
    </div>
  )
}
