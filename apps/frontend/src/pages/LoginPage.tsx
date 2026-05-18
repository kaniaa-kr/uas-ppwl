import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"
import LogoInstagram from "../assets/logo-instagram.jpg"
import MetaLogo from "../assets/Meta.jpg"

const API_URL = import.meta.env.VITE_API_URL

export default function LoginPage() {
  // State sinkron 100% dengan arahan modul
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  // Fungsi Handler Login Utama sesuai Bab 5.6
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

      // Berjabat tangan sempurna dengan tipe AuthUser di Zustand Store
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

  // Interseptor ketukan tombol Enter untuk kenyamanan UX
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col font-sans overflow-x-hidden selection:bg-blue-200">
      <div className="flex-1 w-full flex flex-row items-stretch relative">
        
        {/* ========================================== */}
        {/* IDENTITAS BRANDING KIRI ATAS               */}
        {/* ========================================== */}
        <div className="absolute top-6 left-8 z-50">
          <img
            src={LogoInstagram}
            alt="Instagram"
            className="w-12 h-12 object-contain rounded-md"
          />
        </div>

        {/* ========================================== */}
        {/* PANEL ILUSTRASI HERO (SISI KIRI)           */}
        {/* ========================================== */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-white p-12 relative">
          <div className="w-full max-w-115 flex flex-col items-center">
            <h1 className="text-4xl font-normal tracking-tight text-gray-900 leading-tight mb-12 text-center">
              See everyday moments from your <br />
              <span className="font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                close friends
              </span>
              .
            </h1>

            {/* Komposisi Tumpukan Foto Kreatif */}
            <div className="relative w-full h-70 flex items-center justify-center select-none">
              <div className="absolute left-4 w-33.75 h-48.75 rounded-2xl overflow-hidden border-2 border-white shadow-lg rotate-[-10deg] hover:rotate-0 transition-transform duration-300 z-10">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"
                  alt="Friend"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px]">
                  ❤️
                </div>
              </div>

              <div className="absolute z-20 w-[180px] h-[240px] rounded-[28px] overflow-hidden border-4 border-white shadow-2xl hover:scale-105 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                  alt="Friend"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 w-full px-3 py-2 flex items-center justify-between bg-black/10 backdrop-blur-sm">
                  <div className="w-14 h-1.5 bg-white/60 rounded-full"></div>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>

              <div className="absolute right-4 w-[135px] h-[195px] rounded-2xl overflow-hidden border-2 border-white shadow-lg rotate-[12deg] hover:rotate-0 transition-transform duration-300 z-10">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80"
                  alt="Friend"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[8px] font-bold text-purple-600">
                    ★
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PANEL PANEL INPUT UTAMA (SISI KANAN)       */}
        {/* ========================================== */}
        <div className="w-full lg:w-[480px] bg-white border-l border-gray-200 flex flex-col items-center justify-center p-8 sm:p-12 relative">
          
          <div className="absolute top-6 left-8 flex flex-col gap-1.5 select-none">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-black self-start bg-transparent border-none cursor-pointer p-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="w-full max-w-[350px] flex flex-col mt-8">
            <div className="lg:hidden mb-6 self-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                alt="Instagram"
                className="w-14 h-14 object-contain"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4 self-start tracking-tight">
              Login into Instagram
            </h3>

            <div className="w-full flex flex-col gap-3">
              {/* INPUT KONTROL EMAIL */}
              <input
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white placeholder-gray-400 disabled:opacity-50 text-black"
              />

              {/* INPUT KONTROL PASSWORD */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Password"
                  style={{
                    WebkitTextSecurity: showPassword ? 'none' : 'disc',
                    MozTextSecurity: showPassword ? 'none' : 'disc',
                  } as React.CSSProperties}
                  className="w-full px-4 pr-12 py-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white placeholder-gray-400 disabled:opacity-50 text-black"
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[11px] font-semibold text-gray-600 hover:text-black bg-transparent border-none cursor-pointer focus:outline-none"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>

              {/* ACTION BUTTON LOG IN */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-2.5 bg-[#4796ec] hover:bg-blue-600 text-white font-semibold rounded-full text-xs transition-colors duration-200 mt-2 disabled:opacity-60 flex justify-center items-center cursor-pointer border-none"
              >
                {loading ? 'Sedang masuk...' : 'Log in'}
              </button>
            </div>

            <button
              type="button"
              className="text-xs font-medium text-gray-600 hover:text-black hover:underline mt-4 mb-5 bg-transparent border-none cursor-pointer self-center"
            >
              Forgot password?
            </button>

            {/* PENGALIH ALUR KE REGISTER */}
            <div className="w-full flex flex-col gap-2.5 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => {
                  toast.info("Fitur Google Login tidak diaktifkan pada modul tugas pekan ini.");
                }}
                className="w-full py-2.5 border border-gray-300 rounded-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 bg-gray-50/50 cursor-not-allowed"
              >
                <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.3 1.52-1.15 2.82-2.4 3.68v3.05h3.88c2.27-2.1 3.65-5.17 3.65-8.58z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.41-2.24V6.61H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.39l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z" />
                </svg>
                Log in with Google
              </button>

              <Link
                to="/register"
                className="w-full py-2.5 border border-blue-500 rounded-full text-xs font-bold text-blue-500 bg-white hover:bg-blue-50/40 transition text-center no-underline block"
              >
                Create new account
              </Link>

              {/* WATERMARK LABELLING */}
              <div className="w-full flex items-center gap-1.5 mb-5 select-none justify-center mt-4">
                <img
                  src={MetaLogo}
                  alt="Meta Logo"
                  className="h-3 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-[12px] text-center font-bold tracking-tight text-gray-400">
                  Meta
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* SEKSI FOOTER LENGKAP                       */}
      {/* ========================================== */}
      <footer className="w-full py-12 bg-white border-t border-gray-200 text-[12px] text-gray-500 mt-auto">
        <div className="w-full max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-center font-medium">
            {[
              'Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy', 'Terms',
              'Locations', 'Popular', 'Instagram Lite', 'Meta AI', 'Threads',
              'Contact Uploading & Non-Users', 'Meta Verified', 'Meta in Indonesia',
            ].map((item) => (
              <a key={item} href="#" className="hover:underline text-gray-400 no-underline whitespace-nowrap transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-[11px] mt-2">
            <span className="cursor-pointer hover:text-gray-600 font-medium">English</span>
            <span>© 2026 Instagram from Meta</span>
          </div>
        </div>
      </footer>
    </div>
  )
}