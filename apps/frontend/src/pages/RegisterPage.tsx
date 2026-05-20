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
    // Validasi
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
          <p className="text-gray-500 text-sm mt-1">Bergabung dengan kami</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            name="name"
            type="text"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="username"
            type="text"
            placeholder="Username (tanpa spasi)"
            value={form.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min. 6 karakter)"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition"
          >
            {loading ? "Sedang mendaftar..." : "Daftar"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}