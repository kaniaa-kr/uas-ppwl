import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

// ==========================================
// TEMPAT MENARUH GAMBAR LOKAL KAMU (AMAN UNTUK DEPLOY)
// ==========================================
// Pastikan file "login-side.webp" dan "logo-main.webp" 
// sudah ada di folder src/assets/ sebelum menjalankan kodenya.
import ilustrasiSamping from "../assets/login-side.webp"
import logoUtama from "../assets/logo-main.webp"

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
      toast.success(`Selamat Datang, ${data.user.name || data.user.username}! 👋`)
      navigate("/")
    } catch (e: any) {
      toast.error(e.message || "Login gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-950 dark:text-neutral-50 flex items-center justify-center px-4 md:px-8 transition-colors duration-200">
      <div className="w-full max-w-[800px] flex items-center justify-center gap-12">
        
        {/* GAMBAR DISAMPING (Hanya muncul di layar ukuran MD ke atas / Desktop) */}
        {ilustrasiSamping && (
          <div className="hidden md:block w-1/2 max-w-[380px] aspect-[9/16] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/20 shadow-sm">
            <img 
              src={ilustrasiSamping} 
              alt="Ilustrasi Aplikasi" 
              className="w-full h-full object-cover select-none pointer-events-none"
              onError={(e) => {
                // Supaya kalau gambar lokal belum ada, dia tidak menampilkan ikon box picture rusak
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        )}

        {/* CONTAINER FORM LOGIN & GAMBAR TENGAH */}
        <div className="w-full max-w-[350px] flex flex-col gap-3">
          
          {/* Main Box Login Form */}
          <div className="bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl px-6 py-8 md:px-8 flex flex-col items-center shadow-sm dark:shadow-none">
            
            {/* GAMBAR LOGO UTAMA */}
            {logoUtama ? (
              <div className="mb-6 max-h-[60px] flex items-center justify-center">
                <img 
                  src={logoUtama} 
                  alt="Logo Insuta" 
                  className="max-h-full object-contain"
                  onError={(e) => {
                    // Fallback menyembunyikan gambar yang error
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            ) : (
              /* Fallback teks jika gambar logoUtama gagal diload (opsional) */
              <h1 className="text-[32px] font-bold tracking-wider mb-8 text-neutral-950 dark:text-neutral-50 italic select-none">
                INSUTA
              </h1>
            )}

            <div className="w-full flex flex-col gap-4">
              {/* Username Input */}
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none border border-neutral-200 dark:border-neutral-800/80 rounded-xl px-4 py-3 text-[14px] focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="relative flex flex-col gap-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none border border-neutral-200 dark:border-neutral-800/80 rounded-xl px-4 py-3 text-[14px] pr-11 focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[13px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full mt-2 bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold py-[10px] rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center min-h-[40px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
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
          <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl px-8 py-5 text-center shadow-sm dark:shadow-none">
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400">
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
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-neutral-400 dark:text-neutral-600 text-[11px]">
              <a href="#" className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">Tentang</a>
              <span>·</span>
              <a href="#" className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">Bantuan</a>
              <span>·</span>
              <a href="#" className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">Privasi</a>
              <span>·</span>
              <a href="#" className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">Ketentuan</a>
            </div>
            <p className="text-neutral-400 dark:text-neutral-600 text-[11px] mt-2 uppercase tracking-wider">
              © 2026 INSUTA
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}