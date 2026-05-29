import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleRegister = async () => {
    if (!form.name || !form.username || !form.email || !form.password) {
      toast.error("Semua field wajib diisi")
      return
    }
    if (form.password !== form.confirm) {
      toast.error("Konfirmasi password tidak cocok")
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
        body: JSON.stringify({
          name: form.name.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Registrasi gagal")
      }
      const data = await res.json()
      setAuth(data.user, data.token)
      navigate("/")
    } catch (e: any) {
      toast.error(e.message || "Registrasi gagal")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full bg-[#121212] border border-[#363636] rounded-lg px-4 py-3 text-[14px] text-white placeholder-[#6b6b6b] outline-none focus:border-[#737373] transition-colors"

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[400px]">
        {/* Card */}
        <div className="bg-[#1a1a1a] border border-[#363636] rounded-2xl px-8 py-10 mb-4">
          {/* Logo */}
          <h1
            className="text-white text-center mb-3 leading-none"
            style={{
              fontFamily: "Billabong, 'Grand Hotel', cursive",
              fontStyle: "italic",
              fontSize: "3rem",
            }}
          >
            Insuta
          </h1>

          {/* Tagline */}
          <p className="text-[#737373] text-[14px] text-center font-semibold mb-6 leading-snug">
            Daftar untuk melihat foto dan video dari teman-temanmu.
          </p>

          {/* Form */}
          <div className="flex flex-col gap-3">
            <input
              name="email"
              type="email"
              placeholder="Nomor ponsel atau email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="name"
              type="text"
              placeholder="Nama lengkap"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="username"
              type="text"
              placeholder="Nama pengguna"
              value={form.username}
              onChange={handleChange}
              className={inputClass}
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={inputClass + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <input
              name="confirm"
              type="password"
              placeholder="Konfirmasi password"
              value={form.confirm}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className={inputClass}
            />

            <p className="text-[11px] text-[#737373] text-center leading-snug mt-1">
              Dengan mendaftar, kamu menyetujui{" "}
              <a href="#" className="text-[#a0a0a0] hover:text-white">
                Ketentuan
              </a>{" "}
              dan{" "}
              <a href="#" className="text-[#a0a0a0] hover:text-white">
                Kebijakan Privasi
              </a>{" "}
              kami.
            </p>

            <button
              onClick={handleRegister}
              disabled={loading || !form.name || !form.username || !form.email || !form.password}
              className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Mendaftar...
                </span>
              ) : (
                "Daftar"
              )}
            </button>
          </div>
        </div>

        {/* Login link */}
        <div className="bg-[#1a1a1a] border border-[#363636] rounded-2xl px-8 py-5 text-center">
          <p className="text-[14px] text-[#a0a0a0]">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-[#0095f6] font-semibold hover:text-[#1877f2] transition-colors"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
