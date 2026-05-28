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
  
  // State untuk kontrol show/hide password
  const [showPassword, setShowPassword] = useState(false)

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
        setLoading(false)
        return
      }

      toast.success(`Akun berhasil dibuat! Selamat datang, ${data.user.name}! 🎉`)
      setAuth(data.user, data.accessToken)
      
      setTimeout(() => {
        setLoading(false)
        navigate("/")
      }, 2000)

    } catch (error) {
      console.error("Register error:", error)
      toast.error("Terjadi kesalahan sistem atau jaringan")
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister(e)
  }

  return (
    <div className="w-full min-h-screen bg-white font-sans text-black overflow-x-hidden antialiased">

      {/* 🛠️ PERBAIKAN STYLING SECARA MENYELURUH */}
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

        /* ── FLOATING LABEL: Rapi di Tengah Kotak & Tidak Menabrak Border ── */
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
          font-size: 14px;
          color: #737373;
          font-weight: normal;
          z-index: 1;
        }
        .input-wrapper input:focus ~ label,
        .input-wrapper input:not(:placeholder-shown) ~ label {
          top: 10px;
          transform: translateY(-50%) scale(0.8);
          color: #737373;
          transform-origin: left center;
        }

        /* Khusus label merah saat username tidak tersedia */
        .username-invalid-wrapper input:focus ~ label,
        .username-invalid-wrapper input:not(:placeholder-shown) ~ label {
          color: #ed4956 !important;
        }

        /* ── EFEK HOVER, FOCUS & MEMBUNUH OUTLINE BROWSER ── */
        .reg-input {
          transition: border-color 0.15s ease-out, background-color 0.15s ease-out;
          background-color: transparent !important;
        }
        .reg-input:hover:not(:focus):not(:disabled) {
          border-color: #a8a8a8 !important;
        }
        
        .reg-input:focus,
        .reg-input:invalid, 
        .reg-input:valid,
        .reg-input:focus:invalid,
        .reg-input:focus:valid {
          outline: none !important;
          box-shadow: none !important;
        }
        
        .reg-input:focus {
          border-color: #0095f6 !important;
        }
        .reg-input:focus::placeholder {
          color: transparent !important;
        }

        /* ── 🌟 FORCE FIX: HILANGKAN LATAR BELAKANG BIRU AUTOFILL BROWSER ── */
        .reg-input:-webkit-autofill,
        .reg-input:-webkit-autofill:hover, 
        .reg-input:-webkit-autofill:focus,
        .reg-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: black !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* ── INTERFACES FOOTER: Memaksa Lebar Penuh & Mepet Maksimal Ke Atas ── */
        footer {
          width: 100% !important;
          max-width: 100vw !important;
          margin-top: 12px !important; 
          padding: 8px 0 24px 0 !important; 
          box-sizing: border-box;
        }
        .footer-container {
          width: 100% !important;
          max-width: 1200px !important; 
          margin: 0 auto !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 12px !important; 
        }
        .footer-links {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 8px 16px !important; 
          padding: 0 20px !important;
          line-height: 1.5 !important;
        }
      `}</style>
    

      {/* Kontainer tengah */}
      <div className="flex flex-col items-center justify-start pt-6 w-full bg-white box-border">

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
            className="w-full flex flex-col gap-[12px] box-border border-0 border-transparent shadow-none outline-none"
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
              <div className="input-wrapper relative flex items-center w-full">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  disabled={loading}
                  placeholder=" "
                  value={form.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="reg-input w-full pl-4 pr-12 pt-5 pb-2 border border-gray-200 rounded-[12px] text-[14px] bg-white text-black disabled:bg-gray-50 box-border"
                  required
                />
                <label>Password</label>
                
                {/* Tombol Toggle Mata */}
                {form.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-black z-10 focus:outline-none flex items-center justify-center select-none"
                    style={{ height: '24px', width: '24px', background: 'none', border: 'none' }}
                  >
                    {showPassword ? (
                      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644M7.5 4.872a11.963 11.963 0 0111 0m-14 14.25a11.963 11.963 0 0014 0M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    )}
                  </button>
                )}
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
              <div className={`input-wrapper relative flex items-center w-full ${form.username.toLowerCase() === 'rizma' ? 'username-invalid-wrapper' : ''}`}>
                <input
                  name="username"
                  type="text"
                  disabled={loading}
                  placeholder=" "
                  value={form.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`reg-input w-full pl-4 pr-12 pt-5 pb-2 border rounded-[12px] text-[14px] bg-white text-black disabled:bg-gray-50 box-border ${
                    form.username === "" 
                      ? "border-gray-200" 
                      : form.username.toLowerCase() === "rizma"
                        ? "border-[#ed4956] focus:border-[#ed4956]! text-[#ed4956]" 
                        : "border-gray-200"
                  }`}
                  required
                />
                <label style={{ color: form.username.toLowerCase() === 'rizma' ? '#ed4956' : '#737373' }}>Username</label>

                {/* Indikator Ikon Validasi Status */}
                {form.username && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none">
                    {form.username.toLowerCase() === "rizma" ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#ed4956" strokeWidth="2"/>
                        <path d="M15 9l-6 6M9 9l6 6" stroke="#ed4956" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#008000" strokeWidth="2"/>
                        <path d="M8.5 12.5l2.5 2.5 5-5" stroke="#008000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                )}
              </div>
              
              {/* Teks Error saat username tidak tersedia */}
              {form.username.toLowerCase() === "rizma" && (
                <div className="text-[#ed4956] text-[13px] mt-1.5 flex items-center gap-1 font-normal">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>The username rizma is not available.</span>
                </div>
              )}
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
      <footer>
        <div className="footer-container">
          <div className="footer-links">
            {["Meta","About","Blog","Jobs","Help","API","Privacy","Terms","Locations","Popular","Instagram Lite","Meta AI","Threads","Contact Uploading & Non-Users","Meta Verified"].map((item) => (
              <a key={item} href="#" style={{ fontSize: "12px", color: "#737373", textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0px", fontSize: "12px", color: "#737373", marginTop: "-4px" }}>
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