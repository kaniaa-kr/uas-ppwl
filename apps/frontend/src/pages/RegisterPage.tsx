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
      
      // 🌟 PENAMBAHAN: Menunda navigasi ke halaman utama selama 2 detik (2000ms)
      setTimeout(() => {
        navigate("/")
      }, 2000)

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
    <div className="w-full min-h-screen bg-white font-sans text-black overflow-x-hidden antialiased">

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

        /* ── FLOATING LABEL ── */
        .input-wrapper {
          position: relative;
          width: 100%;
        }
        .input-wrapper label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          transition: all 0.15s ease-out;
          background: white;
          padding: 0 4px;
          font-size: 14px;
          color: #9ca3af;
          font-weight: normal;
        }
        .input-wrapper input:focus ~ label,
        .input-wrapper input:not(:placeholder-shown) ~ label {
          top: 12px;
          transform: translateY(-50%) scale(0.8);
          color: #737373;
          transform-origin: left center;
        }

        /* ── EFEK HOVER & FOCUS INPUT REGISTRASI ── */
        .reg-input {
          transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
        }
        .reg-input:hover:not(:focus):not(:disabled) {
          border-color: #9ca3af !important;
        }
        .reg-input:focus {
          border-color: #0095f6 !important;
          background-color: transparent !important;
          outline: none !important;
        }
        .reg-input:focus::placeholder {
          color: transparent !important;
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

          {/* Logo Meta - 🌟 PERBAIKAN: Mengubah gap menjadi super mepet */}
          <div className="w-full flex items-center gap-[3px] mb-2 select-none justify-start">
            <img
              src={MetaLogo}
              alt="Meta Logo"
              className="h-[30px] w-auto object-contain block"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="text-[17px] font-bold tracking-tight text-gray-600 uppercase leading-none" style={{ marginTop: "1px" }}>
              Meta
            </span>
          </div>

          {/* Judul Halaman */}
          <div className="w-full text-left mb-5">
            <h5 className="text-[26px] font-bold tracking-tight text-black mb-1.5 leading-tight">
              Get started on Instagram
            </h5>
            <p className="text-[14.5px] text-gray-600 font-normal leading-normal">
              Sign up to see photos and videos from your friends.
            </p>
          </div>

          {/* Form Utama */}
          <form
            onSubmit={handleRegister}
            className="w-full flex flex-col gap-[15px] box-border border-0 border-transparent shadow-none outline-none"
            style={{ border: 'none', borderWidth: '0px', boxShadow: 'none' }}
          >

            {/* 1. Mobile number or email */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <label className="text-[17px] font-semibold text-black">Mobile number or email</label>
              <div className="input-wrapper">
                <input
                  name="email"
                  type="text"
                  disabled={loading}
                  placeholder=" "
                  value={form.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="reg-input w-full px-4 pt-5 pb-2 border border-gray-200 rounded-[12px] text-[14px] bg-white text-black disabled:bg-gray-50 box-border"
                  required
                />
                <label>Mobile number or email</label>
              </div>
            </div>

            {/* Catatan Info Kontak */}
            <div className="text-[15px] text-left text-gray-800 leading-normal font-normal w-full box-border -mt-2">
              You may receive notifications from us. <a href="#" className="text-[#0064E0] font-semibold no-underline hover:underline">Learn why we ask for your contact information</a>
            </div>

            {/* 2. Password */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <label className="text-[17px] font-semibold text-black">Password</label>
              <div className="input-wrapper">
                <input
                  name="password"
                  type="password"
                  disabled={loading}
                  placeholder=" "
                  value={form.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="reg-input w-full px-4 pt-5 pb-2 border border-gray-200 rounded-[12px] text-[14px] bg-white text-black disabled:bg-gray-50 box-border"
                  required
                />
                <label>Password</label>
              </div>
            </div>

            {/* 3. Birthday */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <div className="flex items-center gap-1">
                <label className="text-[17px] font-semibold text-black">Birthday</label>
                <div style={{ display: "inline-flex", alignItems: "center", cursor: "help", marginLeft: "2px" }}>
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#737373" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
              </div>
              
              <div className="flex gap-2.5 w-full box-border">
                
                {/* Month */}
                <div className="flex-1 relative">
                  <select
                    value={birthdayUi.month}
                    disabled={loading}
                    onChange={(e) => setBirthdayUi(prev => ({ ...prev, month: e.target.value }))}
                    className={`reg-input w-full appearance-none p-3 pr-10 border border-gray-200 rounded-[12px] text-[14px] bg-white box-border cursor-pointer ${birthdayUi.month ? 'text-black' : 'text-gray-400'}`}
                    required
                  >
                    <option value="" className="text-gray-400">Month</option>
                    {months.map((m) => <option key={m} value={m} className="text-black">{m}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-800 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                {/* Day */}
                <div className="flex-1 relative">
                  <select
                    value={birthdayUi.day}
                    disabled={loading}
                    onChange={(e) => setBirthdayUi(prev => ({ ...prev, day: e.target.value }))}
                    className={`reg-input w-full appearance-none p-3 pr-10 border border-gray-200 rounded-[12px] text-[14px] bg-white box-border cursor-pointer ${birthdayUi.day ? 'text-black' : 'text-gray-400'}`}
                    required
                  >
                    <option value="" className="text-gray-400">Day</option>
                    {days.map((d) => <option key={d} value={d} className="text-black">{d}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-800 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                {/* Year */}
                <div className="flex-1 relative">
                  <select
                    value={birthdayUi.year}
                    disabled={loading}
                    onChange={(e) => setBirthdayUi(prev => ({ ...prev, year: e.target.value }))}
                    className={`reg-input w-full appearance-none p-3 pr-10 border border-gray-200 rounded-[12px] text-[14px] bg-white box-border cursor-pointer ${birthdayUi.year ? 'text-black' : 'text-gray-400'}`}
                    required
                  >
                    <option value="" className="text-gray-400">Year</option>
                    {years.map((y) => <option key={y} value={y} className="text-black">{y}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-800 flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Name */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <label className="text-[17px] font-semibold text-black">Name</label>
              <div className="input-wrapper">
                <input
                  name="name"
                  type="text"
                  disabled={loading}
                  placeholder=" "
                  value={form.name}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="reg-input w-full px-4 pt-5 pb-2 border border-gray-200 rounded-[12px] text-[14px] bg-white text-black disabled:bg-gray-50 box-border"
                  required
                />
                <label>Full name</label>
              </div>
            </div>

            {/* 5. Username */}
            <div className="flex flex-col text-left gap-1 w-full box-border">
              <label className="text-[17px] font-semibold text-black">Username</label>
              <div className="input-wrapper">
                <input
                  name="username"
                  type="text"
                  disabled={loading}
                  placeholder=" "
                  value={form.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="reg-input w-full px-4 pt-5 pb-2 border border-gray-200 rounded-[12px] text-[14px] bg-white text-black disabled:bg-gray-50 box-border"
                  required
                />
                <label>Username</label>
              </div>
            </div>

            {/* Kebijakan / Legalities */}
            <div className="text-[15px] text-left text-gray-800 flex flex-col gap-2 mt-1 leading-relaxed font-normal w-full box-border">
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
              <p className="text-gray-800">
                The <a href="#" className="text-[#0064E0] font-semibold no-underline hover:underline">Privacy Policy</a> describes the ways we can use the information we collect when you create an account. For example, we use this information to provide, personalize and improve our products, including ads.
              </p>
            </div>

            {/* Tombol Aksi */}
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

      {/* FOOTER */}
      <footer style={{
        width: "100%",
        background: "#ffffff",
        padding: "24px 0"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 16px" }}>
            {["Meta","About","Blog","Jobs","Help","API","Privacy","Terms","Locations","Popular","Instagram Lite","Meta AI","Threads","Contact Uploading & Non-Users","Meta Verified","Meta in Indonesia"].map((item) => (
              <a key={item} href="#" style={{ fontSize: "12px", color: "#737373", textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0px", fontSize: "12px", color: "#737373" }}>
            
            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
              <select 
                defaultValue="en"
                style={{
                  fontSize: "12px",
                  color: "#737373",
                  background: "transparent",
                  border: "none",
                  width: "42px",
                  padding: "0px",
                  cursor: "pointer",
                  outline: "none",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none"
                }}
                onChange={(e) => {
                  console.log("Bahasa diganti ke:", e.target.value);
                }}
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
                <option value="ms">Bahasa Melayu</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="ja">日本語</option>
              </select>
              
              <svg 
                width="10" 
                height="10" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#737373" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ pointerEvents: "none", marginLeft: "2px" }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            <span style={{ marginLeft: "8px" }}>© 2026 Instagram from Meta</span>

          </div>
        </div>
      </footer>

    </div>
  )
}