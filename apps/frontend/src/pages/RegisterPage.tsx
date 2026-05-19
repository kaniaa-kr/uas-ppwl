import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"

import MetaLogo from "../assets/Meta.jpg"

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
const years = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  })

  const [birthdayUi, setBirthdayUi] = useState({ month: "", day: "", year: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.email || !form.password || !form.name || !form.username) {
      toast.error("Semua field wajib diisi")
      return
    }

    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    if (!birthdayUi.month || !birthdayUi.day || !birthdayUi.year) {
      toast.error("Silakan lengkapi tanggal lahir Anda!")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
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
      toast.success(`Akun berhasil dibuat! Selamat datang, ${data.user.name}! 🎉`)
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
    // Pembungkus luar aplikasi utama - Polos putih total
    <div className="w-full min-h-screen bg-white flex flex-col font-sans text-black overflow-x-hidden antialiased">

      {/* 🛠️ TRiK PAMUNGKAS: Membunuh paksa border template bawaan dari CSS global khusus untuk halaman ini */}
      <style>{`
        #center { 
          gap: 0px !important; 
          padding: 0px !important;
        }
        #next-steps, #spacer, .ticks { 
          display: none !important; 
          border: none !important; 
          height: 0px !important; 
        }
      `}</style>

      {/* Kontainer tengah - Bersih tanpa border vertikal/samping */}
      <div className="flex-1 flex flex-col items-center justify-start pt-6 pb-6 w-full bg-white box-border">

        {/* Kontainer Pembungkus Lebar Form */}
        <div className="w-full max-w-[580px] flex flex-col items-stretch bg-white box-border px-6 sm:px-0">

          {/* Tombol Kembali (Panah Kiri) */}
          <div className="w-full mb-2 flex justify-start">
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-black transition bg-transparent border-none cursor-pointer p-0.5 disabled:opacity-50 outline-none"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Logo Meta */}
          <div className="w-full flex items-center gap-1.5 mb-2 select-none justify-start">
            <img
              src={MetaLogo}
              alt="Meta Logo"
              className="h-[12px] w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="text-[12px] font-bold tracking-tight text-gray-400">Meta</span>
          </div>

          {/* Judul Halaman - 🌟 DIKECILKAN DIKIT: Ukuran teks disesuaikan agar lebih proporsional */}
          <div className="w-full text-left mb-5">
            <h5 className="text-[26px] font-bold tracking-tight text-black mb-1.5 leading-tight">
              Get started on Instagram
            </h5>
            <p className="text-[14.5px] text-gray-600 font-normal leading-normal">
              Sign up to see photos and videos from your friends.
            </p>
          </div>

          {/* Form Utama (Bebas border luar) */}
          <form
            onSubmit={handleRegister}
            className="w-full flex flex-col gap-[15px] box-border border-0 border-transparent shadow-none outline-none"
            style={{ border: 'none', borderWidth: '0px', boxShadow: 'none' }}
          >

            {/* 1. Mobile number or email - 🌟 DIKECILKAN DIKIT: Menggunakan text-[14px] dan py-3 */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <label className="text-[14px] font-semibold text-black">Mobile number or email</label>
              <input
                name="email"
                type="text"
                disabled={loading}
                placeholder="Mobile number or email"
                value={form.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-[12px] text-[14px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition box-border"
                required
              />
            </div>

            {/* Catatan Info Kontak */}
            <div className="text-[11.5px] text-left text-gray-500 leading-normal font-normal w-full box-border -mt-2">
              You may receive notifications from us. <a href="#" className="text-[#0064E0] font-semibold no-underline hover:underline">Learn why we ask for your contact information</a>
            </div>

            {/* 2. Password */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <label className="text-[14px] font-semibold text-black">Password</label>
              <input
                name="password"
                type="password"
                disabled={loading}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-[12px] text-[14px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition box-border"
                required
              />
            </div>

            {/* 3. Birthday */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <div className="flex items-center gap-1">
                <label className="text-[14px] font-semibold text-black">Birthday</label>
                <span className="text-[13px] text-gray-500 cursor-help">ⓘ</span>
              </div>
              <div className="flex gap-2.5 w-full box-border">
                {/* Month */}
                <div className="flex-1 relative">
                  <select
                    value={birthdayUi.month}
                    disabled={loading}
                    onChange={(e) => setBirthdayUi(prev => ({ ...prev, month: e.target.value }))}
                    className="w-full appearance-none p-3 pr-10 border border-gray-200 rounded-[12px] text-[14px] bg-white text-black focus:outline-none box-border"
                    required
                  >
                    <option value="">Month</option>
                    {months.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[12px]">▼</div>
                </div>

                {/* Day */}
                <div className="flex-1 relative">
                  <select
                    value={birthdayUi.day}
                    disabled={loading}
                    onChange={(e) => setBirthdayUi(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full appearance-none p-3 pr-10 border border-gray-200 rounded-[12px] text-[14px] bg-white text-black focus:outline-none box-border"
                    required
                  >
                    <option value="">Day</option>
                    {days.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[12px]">▼</div>
                </div>

                {/* Year */}
                <div className="flex-1 relative">
                  <select
                    value={birthdayUi.year}
                    disabled={loading}
                    onChange={(e) => setBirthdayUi(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full appearance-none p-3 pr-10 border border-gray-200 rounded-[12px] text-[14px] bg-white text-black focus:outline-none box-border"
                    required
                  >
                    <option value="">Year</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[12px]">▼</div>
                </div>
              </div>
            </div>

            {/* 4. Name */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <label className="text-[14px] font-semibold text-black">Name</label>
              <input
                name="name"
                type="text"
                disabled={loading}
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-[12px] text-[14px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition box-border"
                required
              />
            </div>

            {/* 5. Username */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <label className="text-[14px] font-semibold text-black">Username</label>
              <input
                name="username"
                type="text"
                disabled={loading}
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-[12px] text-[14px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition box-border"
                required
              />
            </div>

            {/* Kebijakan / Legalities */}
            <div className="text-[12px] text-left text-gray-500 flex flex-col gap-2 mt-1 leading-relaxed font-normal w-full box-border">
              <p>
                People who use our service may have uploaded your contact information to Instagram.{" "}
                <a href="#" className="text-[#0064E0] font-semibold no-underline hover:underline">Learn more.</a>
              </p>
              <p>
                By tapping Submit, you agree to create an account and to Instagram's{" "}
                <a href="#" className="text-[#0064E0] font-semibold no-underline hover:underline">Terms</a>,{" "}
                <a href="#" className="text-[#0064E0] font-semibold no-underline hover:underline">Privacy Policy</a> and{" "}
                <a href="#" className="text-[#0064E0] font-semibold no-underline hover:underline">Cookies Policy</a>.
              </p>
              <p className="text-gray-500">
                The <a href="#" className="text-[#0064E0] font-semibold no-underline hover:underline">Privacy Policy</a> describes the ways we can use the information we collect when you create an account. For example, we use this information to provide, personalize and improve our products, including ads.
              </p>
            </div>

            {/* Tombol Aksi - 🌟 DIKECILKAN DIKIT: py-2.5 dan text-[13.5px] kembali ke ukuran semula yang ideal */}
            <div className="flex flex-col gap-3 mt-2 w-full">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0064E0] hover:bg-[#0056b3] text-white font-bold rounded-full text-[13.5px] transition duration-200 cursor-pointer border-none shadow-none disabled:opacity-50 text-center block outline-none"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              <Link
                to="/login"
                className="w-full py-2.5 bg-white text-[#1c1e21] border border-[#ced0d4] hover:bg-gray-100 font-bold rounded-full text-[13.5px] transition duration-200 text-center no-underline block box-border outline-none"
              >
                I already have an account
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Bawah - Tanpa Border Atas */}
      <footer className="w-full max-w-full py-4 bg-white text-[11px] text-gray-400 mt-auto box-border shrink-0">
        <div className="w-full max-w-[1000px] mx-auto px-4 flex flex-col items-center gap-1.5 box-border">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center font-normal w-full">
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