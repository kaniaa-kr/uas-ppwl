import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { toast } from 'sonner';
import LogoInstagram from "../assets/logo-instagram.jpg";

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  // ==========================================
  // OTOMATISASI PASCA-LOGIN GOOGLE OAUTH
  // ==========================================
  useEffect(() => {
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const avatarUrl = searchParams.get('avatarUrl');

    if (token && id && name && email) {
      setAuth(
        {
          id: id,
          name: name,
          email: email,
          avatarUrl: avatarUrl || 'https://via.placeholder.com/150',
        },
        token
      );

      toast.success(`Selamat datang, ${name}! 👋`, {
        description: 'Anda berhasil masuk menggunakan Google.',
        duration: 4000,
      });

      if (onLoginSuccess) onLoginSuccess();
      navigate('/');
    }
  }, [searchParams, setAuth, navigate, onLoginSuccess]);

  // ==========================================
  // HANDLER LOGIN MANUAL (USERNAME & PASSWORD)
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      toast.error('Please fill in your username and password!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuth(
          {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            avatarUrl: data.user.avatarUrl || 'https://via.placeholder.com/150',
          },
          data.accessToken
        );

        toast.success(`Selamat datang kembali, ${data.user.name}! 👋`, {
          description: 'Anda berhasil masuk ke Instagram.',
          duration: 4000,
        });

        if (onLoginSuccess) onLoginSuccess();
        navigate('/');
      } else {
        toast.error(data.message || 'Login gagal. Periksa kembali akun Anda.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan jaringan atau backend offline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col font-sans overflow-x-hidden selection:bg-blue-200">
      
      {/* KONTEN UTAMA - Perbaikan Flex Container Utama */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-300 mx-auto px-6 items-center justify-center gap-12 lg:gap-20 py-10">
        
        {/* KOLOM KIRI: HERO (Dipastikan muncul kembali di layar komputer/desktop) */}
        <div className="hidden lg:flex flex-1 flex-col items-center lg:items-end w-full">
          <div className="w-full max-w-105">
            {/* Logo kecil atas */}
            <div className="mb-6 flex justify-start">
              <img
                src={LogoInstagram}
                alt="Instagram"
                className="w-12 h-12 object-contain"
              />
            </div>

            {/* Slogan */}
            <h1 className="text-4xl xl:text-5xl font-normal tracking-tight text-gray-900 leading-tight mb-10 text-left">
              See everyday moments <br />
              from your{' '}
              <span className="font-semibold bg-linear-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                close friends
              </span>
              .
            </h1>

            {/* Ilustrasi Kartu Tumpuk */}
            <div className="relative w-full h-70 flex items-center justify-center select-none">
              {/* Kartu Kiri */}
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

              {/* Kartu Tengah (Utama) */}
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

              {/* Kartu Kanan */}
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

              {/* Story floating di atas */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-md border border-gray-100">
                {['🧑', '👩', '🧔'].map((emoji, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-xs">
                    {emoji}
                  </div>
                ))}
              </div>

              <div className="absolute top-8 right-8 z-30 bg-green-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow">
                ★ ✓
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: PANEL LOGIN */}
        <div className="w-full max-w-[350px] flex flex-col gap-2">
          {/* Tambahkan sedikit shadow ringan / border halus agar memisahkan box form jika latar belakang putih polos */}
          <div className="bg-white lg:border lg:border-gray-200 rounded-xl p-8 lg:p-10 flex flex-col items-center">

            {/* Logo khusus perangkat mobile */}
            <div className="lg:hidden mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                alt="Instagram"
                className="w-14 h-14 object-contain"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6 self-start tracking-tight">
              Log into Instagram
            </h2>

            {/* Form Input Login Manual */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <input
                type="text"
                disabled={isLoading}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Mobile number, username, or email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white placeholder-gray-400 disabled:opacity-50 text-black"
              />

              <div className="relative flex items-center">
                <input
                  type="text"
                  disabled={isLoading}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#4796ec] hover:bg-blue-600 text-white font-semibold rounded-full text-xs transition-colors duration-200 mt-2 disabled:opacity-60 flex justify-center items-center cursor-pointer border-none"
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <button
              type="button"
              className="text-xs font-medium text-gray-600 hover:text-black hover:underline mt-4 mb-6 bg-transparent border-none cursor-pointer"
            >
              Forgot password?
            </button>

            {/* Tombol Pemisah / OAuth Google */}
            <div className="w-full flex flex-col gap-2.5 border-t border-gray-100 pt-6">
              
              {/* HUBUNGKAN KE BACKEND GOOGLE OAUTH */}
              <button
                type="button"
                onClick={() => {
                  // Rute inisiasi Passport.js Google Strategy di backend kamu
                  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
                }}
                className="w-full py-2.5 border border-gray-300 rounded-full flex items-center justify-center gap-2 text-xs font-bold text-gray-800 bg-white hover:bg-gray-50 transition cursor-pointer"
              >
                {/* SVG Google Multi-warna */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.3 1.52-1.15 2.82-2.4 3.68v3.05h3.88c2.27-2.1 3.65-5.17 3.65-8.58z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.41-2.24V6.61H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.39l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"
                  />
                </svg>
                Log in with Google
              </button>

              <button
                type="button"
                onClick={() => navigate('/register')}
                className="w-full py-2.5 border border-blue-500 rounded-full text-xs font-bold text-blue-500 bg-white hover:bg-blue-50/40 transition cursor-pointer"
              >
                Create new account
              </button>
            </div>

            {/* Meta Brand */}
            <div className="mt-8 flex items-center justify-center gap-1 text-gray-400 font-medium text-[11px]">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#0064E0]">
                <path d="M6.5 6C4 6 2 8.686 2 12s2 6 4.5 6c1.324 0 2.498-.56 3.5-1.556C11.002 17.44 12.176 18 13.5 18c2.5 0 4.5-2.686 4.5-6s-2-6-4.5-6c-1.324 0-2.498.56-3.5 1.556C9.002 6.56 7.824 6 6.5 6zm0 2c.677 0 1.43.4 2.094 1.16A8.914 8.914 0 008 12a8.91 8.91 0 00.594 2.84C7.93 15.6 7.177 16 6.5 16 5.12 16 4 14.21 4 12s1.12-4 2.5-4zm7 0c1.38 0 2.5 1.79 2.5 4s-1.12 4-2.5 4c-.677 0-1.43-.4-2.094-1.16A8.914 8.914 0 0016 12a8.91 8.91 0 00-.594-2.84C16.07 8.4 16.823 8 17.5 8h-4z" />
              </svg>
              <span className="text-gray-500 font-bold tracking-wider uppercase text-[10px]">Meta</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-6 bg-white text-[10px] text-gray-400 mt-auto">
        <div className="w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center gap-2.5">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-center">
            {[
              'Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy', 'Terms',
              'Locations', 'Popular', 'Instagram Lite', 'Meta AI', 'Threads',
              'Contact Uploading & Non-Users', 'Meta Verified', 'Meta in Indonesia',
            ].map((item) => (
              <a key={item} href="#" className="hover:underline text-gray-400 no-underline whitespace-nowrap">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>English</span>
            <span>© 2026 Instagram from Meta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}