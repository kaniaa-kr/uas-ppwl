import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; 

// Import asset gambar Meta dari folder assets kamu (.jpg sesuai penamaan barumu)
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.month || !form.day || !form.year) {
      toast.error("Silakan lengkapi tanggal lahir Anda!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: form.contact,
          password: form.password,
          fullName: form.fullName,
          username: form.username,
          birthday: `${form.year}-${form.month}-${form.day}`,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Akun berhasil dibuat! 🎉", {
          description: "Silakan masuk menggunakan akun baru Anda.",
          duration: 4000,
        });
        navigate("/login");
      } else {
        toast.error(data.message || "Pendaftaran gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Terjadi masalah jaringan atau server backend offline.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col font-sans text-black selection:bg-blue-100 overflow-x-hidden antialiased">
      
      {/* AREA UTAMA: Memastikan konten form berada di tengah layar secara vertikal & horisontal */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 w-full">
        
        {/* Kontainer Form dikunci maksimal lebar 350px agar proporsional dan tidak melebar di desktop */}
        <div className="w-full max-w-[350px] flex flex-col items-stretch">
          
          {/* Tombol Kembali (Back Arrow) */}
          <div className="w-full mb-4 flex justify-start">
            <button 
              type="button"
              disabled={isLoading}
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
            
            {/* Kolom No. HP / Email */}
            <div className="flex flex-col text-left gap-1">
              <label className="text-[12px] font-bold text-gray-800">Mobile number or email</label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="Mobile number or email"
                value={form.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition"
                required
              />
              <p className="text-[11px] text-gray-500 leading-normal mt-0.5">
                You may receive notifications from us.{" "}
                <a href="#" className="text-[#0866FF] font-semibold hover:underline no-underline">
                  Learn why we ask for your contact information
                </a>
              </p>
            </div>

            {/* Kolom Password */}
            <div className="flex flex-col text-left gap-0.5">
              <label className="text-[12px] font-bold text-gray-800">Password</label>
              <input
                type="password"
                disabled={isLoading}
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition"
                required
              />
            </div>

            {/* Kolom Pilihan Tanggal Lahir */}
            <div className="flex flex-col text-left gap-1">
              <div className="flex items-center gap-1">
                <label className="text-[12px] font-bold text-gray-800">Birthday</label>
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[10px] text-gray-500 font-bold cursor-help" 
                  title="Why do we ask for your birthday?"
                >
                  ?
                </span>
              </div>
              
              <div className="flex gap-2">
                {/* Dropdown Bulan */}
                <div className="relative flex-1">
                  <select 
                    value={form.month} 
                    disabled={isLoading}
                    onChange={(e) => handleChange("month", e.target.value)} 
                    className="w-full p-2.5 pr-8 border border-gray-300 rounded-xl text-[13px] bg-white cursor-pointer focus:outline-none focus:border-gray-400 appearance-none text-black disabled:bg-gray-50"
                    required
                  >
                    <option value="">Month</option>
                    {months.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Dropdown Hari */}
                <div className="relative flex-1">
                  <select 
                    value={form.day} 
                    disabled={isLoading}
                    onChange={(e) => handleChange("day", e.target.value)} 
                    className="w-full p-2.5 pr-8 border border-gray-300 rounded-xl text-[13px] bg-white cursor-pointer focus:outline-none focus:border-gray-400 appearance-none text-black disabled:bg-gray-50"
                    required
                  >
                    <option value="">Day</option>
                    {days.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Dropdown Tahun */}
                <div className="relative flex-1">
                  <select 
                    value={form.year} 
                    disabled={isLoading}
                    onChange={(e) => handleChange("year", e.target.value)} 
                    className="w-full p-2.5 pr-8 border border-gray-300 rounded-xl text-[13px] bg-white cursor-pointer focus:outline-none focus:border-gray-400 appearance-none text-black disabled:bg-gray-50"
                    required
                  >
                    <option value="">Year</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Nama */}
            <div className="flex flex-col text-left gap-0.5">
              <label className="text-[12px] font-bold text-gray-800">Name</label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition"
                required
              />
            </div>

            {/* Kolom Username */}
            <div className="flex flex-col text-left gap-0.5">
              <label className="text-[12px] font-bold text-gray-800">Username</label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="Username"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-[13px] focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 text-black disabled:bg-gray-50 transition"
                required
              />
            </div>

            {/* Teks Kebijakan Ketentuan */}
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

            {/* Tombol Aksi Form */}
            <div className="flex flex-col gap-2.5 mt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#0064E0] hover:bg-blue-700 text-white font-bold rounded-full text-[13.5px] transition duration-200 cursor-pointer border-none shadow-sm disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => navigate("/login")}
                className="w-full py-2.5 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 font-bold rounded-full text-[13.5px] transition duration-200 cursor-pointer disabled:opacity-50"
              >
                I already have an account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Utama */}
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
  );
}