import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner" 

// Import asset gambar Meta dari folder assets kamu
import MetaLogo from "../assets/Meta.jpg" 

// Tetap pertahankan array untuk keindahan UI drop-down jika ingin ditampilkan, 
// namun datanya tidak perlu dikirim ke backend panduan agar tidak error.
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
const years = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  
  // 1. State disesuaikan 100% dengan kebutuhan skema database panduan
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  })
  
  // Tambahan state lokal untuk variasi UI tanggal lahir agar tidak merusak payload backend
  const [birthdayUi, setBirthdayUi] = useState({ month: "", day: "", year: "" })
  const [loading, setLoading] = useState(false)

  // 2. Fungsi handleChange standar mengikuti panduan baku
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // 3. Handler utama pendaftaran yang sinkron dengan backend Elysia/Express panduan
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi Lapangan Form Sesuai Panduan
    if (!form.name || !form.username || !form.email || !form.password) {
      toast.error("Semua field wajib diisi")
      return
    }

    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    // Validasi tambahan khusus UI Instagram kamu
    if (!birthdayUi.month || !birthdayUi.day || !birthdayUi.year) {
      toast.error("Silakan lengkapi tanggal lahir Anda!")
      return
    }

    setLoading(true)
    try {
      // Menggunakan VITE_API_URL sesuai dengan file .env panduan
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // Payload bersih mengirim data yang diminta backend
      })
      
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Registrasi gagal")
        return
      }

      // 4. Menyimpan sesi user ke Zustand Store agar langsung masuk (Log In otomatis)
      setAuth(data.user, data.accessToken)
      toast.success(`Akun berhasil dibuat! Selamat datang, ${data.user.name}! 🎉`)
      
      // Redirect langsung ke Dashboard / Homepage utama
      navigate("/")
    } catch (error) {
      console.error("Register error:", error)
      toast.error("Terjadi kesalahan sistem atau jaringan")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister(e)
  }

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col font-sans text-black selection:bg-blue-100 overflow-x-hidden antialiased">
      
      {/* AREA UTAMA */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 w-full">
        <div className="w-full max-w-[350px] flex flex-col items-stretch">
          
          {/* Tombol Kembali ke Login */}
          <div className="w-full mb-4 flex justify-start">
            <button 
              type="button"
              disabled={loading}
              onClick={() => navigate("/login")} 
              className="text-gray-800 hover:text-black transition bg-transparent border-none cursor-pointer p-0.5 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Logo Meta */}
          <div className="w-full flex items-center gap-1.5 mb-5 select-none justify-start">
            <img 
              src={MetaLogo} 
              alt="Meta Logo" 
              className="h-3 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-[12px] font-bold tracking-tight text-gray-400">Meta</span>
          </div>

          {/* Judul & Deskripsi Halaman */}
          <div className="w-full text-left mb-6">
            <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-2 leading-tight">
              Get started on Instagram
            </h5>
            <p className="text-[13px] text-gray-500 font-normal leading-normal">
              Sign up to see photos and videos from your friends.
            </p>
          </div>

          {/* Form Input Data */}
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
            
            {/* Kolom Nama Lengkap (Properti 'name' sesuai panduan) */}
            <div className="flex flex-col text-left gap-1">
              <label className="text-[12px] font-bold text-gray-800">Full Name</label>
              <input
                name="name"
                type="text"
                disabled={loading}
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition"
                required
              />
            </div>

            {/* Kolom Username (Properti 'username' sesuai panduan) */}
            <div className="flex flex-col text-left gap-1">
              <label className="text-[12px] font-bold text-gray-800">Username</label>
              <input
                name="username"
                type="text"
                disabled={loading}
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition"
                required
              />
            </div>

            {/* Kolom Email (Properti 'email' sesuai panduan) */}
            <div className="flex flex-col text-left gap-1">
              <label className="text-[12px] font-bold text-gray-800">Email address</label>
              <input
                name="email"
                type="email"
                disabled={loading}
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition"
                required
              />
            </div>

            {/* Kolom Password (Properti 'password' sesuai panduan) */}
            <div className="flex flex-col text-left gap-1">
              <label className="text-[12px] font-bold text-gray-800">Password</label>
              <input
                name="password"
                type="password"
                disabled={loading}
                placeholder="Password (min. 6 characters)"
                value={form.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition"
                required
              />
            </div>

            {/* Kolom Pilihan Tanggal Lahir (Hanya untuk kosmetik UI Instagram) */}
            <div className="flex flex-col text-left gap-1">
              <div className="flex items-center gap-1">
                <label className="text-[12px] font-bold text-gray-800">Birthday</label>
              </div>
              
              <div className="flex gap-2">
                <select 
                  value={birthdayUi.month} 
                  disabled={loading}
                  onChange={(e) => setBirthdayUi(prev => ({...prev, month: e.target.value}))} 
                  className="flex-1 p-2.5 border border-gray-300 rounded-xl text-[13px] bg-white text-black text-xs focus:outline-none"
                  required
                >
                  <option value="">Month</option>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>

                <select 
                  value={birthdayUi.day} 
                  disabled={loading}
                  onChange={(e) => setBirthdayUi(prev => ({...prev, day: e.target.value}))} 
                  className="flex-1 p-2.5 border border-gray-300 rounded-xl text-[13px] bg-white text-black text-xs focus:outline-none"
                  required
                >
                  <option value="">Day</option>
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>

                <select 
                  value={birthdayUi.year} 
                  disabled={loading}
                  onChange={(e) => setBirthdayUi(prev => ({...prev, year: e.target.value}))} 
                  className="flex-1 p-2.5 border border-gray-300 rounded-xl text-[13px] bg-white text-black text-xs focus:outline-none"
                  required
                >
                  <option value="">Year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Teks Regulasi Legal */}
            <div className="text-[11px] text-left text-gray-500 flex flex-col gap-3 mt-1 leading-relaxed font-normal">
              <p>
                People who use our service may have uploaded your contact information to Instagram.{" "}
                <a href="#" className="text-[#0866FF] hover:underline font-semibold no-underline">Learn more.</a>
              </p>
              <p>
                By tapping Submit, you agree to create an account and to Instagram's{" "}
                <a href="#" className="text-[#0866FF] hover:underline font-semibold no-underline">Terms</a>,{" "}
                <a href="#" className="text-[#0866FF] hover:underline font-semibold no-underline">Privacy Policy</a> and{" "}
                <a href="#" className="text-[#0866FF] hover:underline font-semibold no-underline">Cookies Policy</a>.
              </p>
            </div>

            {/* Tombol Aksi Registrasi */}
            <div className="flex flex-col gap-2.5 mt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0064E0] hover:bg-blue-700 text-white font-bold rounded-full text-[13.5px] transition duration-200 cursor-pointer border-none shadow-sm disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              <Link
                to="/login"
                className="w-full py-2.5 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 font-bold rounded-full text-[13.5px] transition duration-200 text-center no-underline block"
              >
                I already have an account
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Komponen */}
      <footer className="w-full py-4 bg-white text-[10px] text-gray-400 border-t border-gray-100">
        <div className="w-full max-w-[1000px] mx-auto px-4 flex flex-col items-center gap-1.5">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center font-normal">
            {['Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy', 'Terms', 'Locations', 'Instagram Lite', 'Contact Uploading & Non-Users', 'Meta Verified'].map((item) => (
              <a key={item} href="#" className="hover:underline text-gray-400 no-underline whitespace-nowrap">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <span>English</span>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            <span className="ml-1">© 2026 Instagram from Meta</span>
          </div>
        </div>
      </footer>

    </div>
  )
}