import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; 

// Import asset gambar Meta dari folder assets kamu
import MetaLogo from "../assets/Meta.jpg"; 

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
const years = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    contact: "",
    password: "",
    month: "",
    day: "",
    year: "",
    fullName: "",
    username: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ==========================================
  // HANDLER PROSES PENDAFTARAN (REGISTRASI)
  // ==========================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi memastikan tanggal lahir lengkap terisi
    if (!form.month || !form.day || !form.year) {
      toast.error("Silakan lengkapi tanggal lahir Anda!");
      return;
    }

    setIsLoading(true);

    try {
      // Mengirimkan data pendaftaran ke endpoint register backend Anda
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: form.contact,
          password: form.password,
          fullName: form.fullName,
          username: form.username,
          birthday: `${form.year}-${form.month}-${form.day}`, // Format string gabungan tanggal lahir
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Akun berhasil dibuat! 🎉", {
          description: "Silakan masuk menggunakan akun baru Anda.",
          duration: 4000,
        });
        
        // Alihkan pengguna ke halaman login setelah sukses mendaftar
        navigate("/login");
      } else {
        // Menampilkan pesan error dari response backend (misal: username sudah digunakan)
        toast.error(data.message || "Pendaftaran gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Terjadi masalah jaringan atau server backend sedang offline.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col font-sans text-black selection:bg-blue-100 overflow-x-hidden">
      
      {/* Kontainer Utama Form */}
      <div className="flex-1 flex flex-col items-center justify-start pt-6 pb-12 px-4 w-full max-w-[440px] mx-auto">
        
        {/* Tombol Kembali (Back Arrow) */}
        <div className="w-full mb-3 flex justify-start">
          <button 
            type="button"
            disabled={isLoading}
            onClick={() => navigate("/login")} 
            className="text-gray-800 hover:text-black transition bg-transparent border-none cursor-pointer p-1 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Logo Meta (Menggunakan file lokal dari folder assets Anda) */}
        <div className="w-full flex items-center gap-1.5 mb-4 select-none justify-start">
          <img 
            src={MetaLogo} 
            alt="Meta Logo" 
            className="h-3.5 w-auto object-contain"
            onError={(e) => {
              // Fallback jika file gambar belum dimasukkan atau namanya salah
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-[14px] font-bold tracking-tight text-gray-900">Meta</span>
        </div>

        {/* Judul & Deskripsi Halaman */}
        <div className="w-full text-left mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1.5">
            Get started on Instagram
          </h1>
          <p className="text-[13px] text-gray-600 font-normal">
            Sign up to see photos and videos from your friends.
          </p>
        </div>

        {/* Form Input Data */}
        <form onSubmit={handleRegister} className="w-full flex flex-col gap-5">
          
          {/* Kolom No. HP / Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">Mobile number or email</label>
            <input
              type="text"
              disabled={isLoading}
              placeholder="Mobile number or email"
              value={form.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-[14px] focus:outline-none focus:border-blue-500 bg-white placeholder-gray-400 text-black disabled:bg-gray-50"
              required
            />
            <p className="text-[11.5px] text-gray-500 leading-normal mt-0.5">
              You may receive notifications from us.{" "}
              <a href="#" className="text-[#0866FF] font-semibold hover:underline no-underline">
                Learn why we ask for your contact information
              </a>
            </p>
          </div>

          {/* Kolom Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">Password</label>
            <input
              type="password"
              disabled={isLoading}
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-[14px] focus:outline-none focus:border-blue-500 bg-white placeholder-gray-400 text-black disabled:bg-gray-50"
              required
            />
          </div>

          {/* Kolom Pilihan Tanggal Lahir */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <label className="text-[13px] font-bold text-gray-900">Birthday</label>
              <span 
                className="w-3.5 h-3.5 rounded-full border border-gray-500 flex items-center justify-center text-[10px] text-gray-600 font-bold cursor-help" 
                title="Why do we ask for your birthday?"
              >
                ?
              </span>
            </div>
            
            <div className="flex gap-2.5">
              {/* Dropdown Bulan */}
              <div className="relative flex-1">
                <select 
                  value={form.month} 
                  disabled={isLoading}
                  onChange={(e) => handleChange("month", e.target.value)} 
                  className="w-full p-3.5 border border-gray-300 rounded-xl text-[14px] bg-white cursor-pointer focus:outline-none focus:border-blue-500 appearance-none text-black disabled:bg-gray-50"
                  required
                >
                  <option value="">Month</option>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* Dropdown Hari */}
              <div className="relative flex-1">
                <select 
                  value={form.day} 
                  disabled={isLoading}
                  onChange={(e) => handleChange("day", e.target.value)} 
                  className="w-full p-3.5 border border-gray-300 rounded-xl text-[14px] bg-white cursor-pointer focus:outline-none focus:border-blue-500 appearance-none text-black disabled:bg-gray-50"
                  required
                >
                  <option value="">Day</option>
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* Dropdown Tahun */}
              <div className="relative flex-1">
                <select 
                  value={form.year} 
                  disabled={isLoading}
                  onChange={(e) => handleChange("year", e.target.value)} 
                  className="w-full p-3.5 border border-gray-300 rounded-xl text-[14px] bg-white cursor-pointer focus:outline-none focus:border-blue-500 appearance-none text-black disabled:bg-gray-50"
                  required
                >
                  <option value="">Year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Nama */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">Name</label>
            <input
              type="text"
              disabled={isLoading}
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-[14px] focus:outline-none focus:border-blue-500 bg-white placeholder-gray-400 text-black disabled:bg-gray-50"
              required
            />
          </div>

          {/* Kolom Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">Username</label>
            <input
              type="text"
              disabled={isLoading}
              placeholder="Username"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-[14px] focus:outline-none focus:border-blue-500 bg-white placeholder-gray-400 text-black disabled:bg-gray-50"
              required
            />
          </div>

          {/* Teks Kebijakan Ketentuan */}
          <div className="text-[11.5px] text-gray-500 flex flex-col gap-3.5 mt-2 leading-relaxed font-normal">
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
            <p>
              The <a href="#" className="text-[#0866FF] hover:underline font-semibold no-underline">Privacy Policy</a> describes the ways we can use the information we collect when you create an account. For example, we use this information to provide, personalize and improve our products, including ads.
            </p>
          </div>

          {/* Tombol Aksi Form */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0064E0] hover:bg-blue-700 text-white font-bold rounded-full text-[14px] transition duration-200 cursor-pointer border-none shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 font-bold rounded-full text-[14px] transition duration-200 cursor-pointer disabled:opacity-50"
            >
              I already have an account
            </button>
          </div>
        </form>
      </div>

      {/* Footer Utama */}
      <footer className="w-full py-6 bg-white text-[11px] text-gray-500 border-t border-gray-100">
        <div className="w-full max-w-[1000px] mx-auto px-4 flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-center font-normal">
            {['Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy', 'Terms', 'Locations', 'Instagram Lite', 'Contact Uploading & Non-Users', 'Meta Verified'].map((item) => (
              <a key={item} href="#" className="hover:underline text-gray-500 no-underline whitespace-nowrap">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 mt-1">
            <span>English</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            <span className="ml-2">© 2026 Instagram from Meta</span>
          </div>
        </div>
      </footer>

    </div>
  );
}