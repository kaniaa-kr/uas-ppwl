import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"
import LogoInstagram from "../assets/logo-instagram.jpg"
import LogoMeta from "../assets/Meta.jpg"

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)

  // VALIDASI BARU: Tombol aktif hanya jika email terisi DAN password minimal 6 karakter
  const isFormValid = email.trim() !== "" && password.trim().length >= 6

  // ==========================================
  // OTOMATISASI PASCA-LOGIN GOOGLE OAUTH
  // ==========================================
  useEffect(() => {
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const emailUrl = searchParams.get('email');
    const avatarUrl = searchParams.get('avatarUrl');

    const usernameFromUrl = searchParams.get('username') || (emailUrl ? emailUrl.split('@')[0] : '');

    if (token && id && name && emailUrl) {
      setAuth(
        {
          id: id,
          name: name,
          email: emailUrl,
          username: usernameFromUrl,
          avatar_url: avatarUrl || undefined
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
  // HANDLER LOGIN MANUAL (FORM)
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return; // Mencegah submit paksa via Enter jika form belum valid

    setIsLoading(true);

    setTimeout(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setAuth(
            {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              username: data.user.username,
              avatar_url: data.user.avatar_url || undefined,
            },
            data.accessToken
          );

          toast.success(`Selamat datang kembali, ${data.user.name}! 👋`, { duration: 4000 });

          if (onLoginSuccess) onLoginSuccess();
          navigate('/');
        } else {
          toast.error(data.error || 'Login gagal. Periksa kembali akun Anda.');
        }
      } catch (error) {
        console.error(error);
        toast.error('Terjadi kesalahan jaringan atau backend offline.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100vw !important;
          height: 100vh !important;
          max-height: 100vh !important;
          overflow: hidden !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #ffffff;
        }
        
        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
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
          background: transparent; 
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
          background: #ffffff; 
        }
        
        /* Mengunci warna background putih murni ketika autofill browser aktif */
        .input-wrapper input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          -webkit-text-fill-color: #1f2937 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .input-wrapper input:-webkit-autofill ~ label {
          background: #ffffff !important;
        }

        .custom-input {
          width: 100%;
          font-size: 14px;
          padding: 20px 16px 8px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 16px;
          background: #ffffff !important; /* Memaksa warna putih murni */
          outline: none;
          color: #1f2937;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .custom-input:hover:not(:focus) {
          border-color: #9ca3af;
        }
        .custom-input:focus {
          border-color: #0095f6 !important;
          background-color: #ffffff !important; /* Menjaga tetap putih saat fokus */
          box-shadow: 0 0 0 3px rgba(71, 150, 236, 0.15);
        }
        .custom-input::placeholder {
          color: transparent;
        }

        /* ── TOMBOL LOGIN: aktif vs nonaktif ── */
        .btn-primary {
          width: 100%;
          padding: 14px 0;
          color: white;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 9999px;
          margin-top: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.2s, opacity 0.2s;
        }
        .btn-primary:not(:disabled) {
          background: #4796ec;
          cursor: pointer;
        }
        .btn-primary:not(:disabled):hover {
          background: #2563eb;
        }
        .btn-primary:disabled {
          background: #b2d4f7;
          cursor: not-allowed;
          opacity: 1;
        }

        .btn-google-login {
          width: 100%;
          padding: 12px 0;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          background: #ffffff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-google-login:hover {
          background: #f9fafb;
        }

        .btn-outline-blue {
          width: 100%;
          padding: 12px 0;
          border: 1px solid #3b82f6;
          border-radius: 9999px;
          color: #3b82f6;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          display: block;
          box-sizing: border-box;
          transition: background-color 0.15s ease;
        }
        .btn-outline-blue:hover {
          background-color: #f0f2f5; 
        }

        .gradient-text {
          font-weight: 600;
          background: linear-gradient(90deg, #f97316 0%, #ec4899 50%, #9333ea 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          display: inline-block;
        }
        footer {
          width: 100% !important;
          max-width: 100vw !important;
          margin-top: 0px !important; 
          padding-top: 12px !important; 
          box-sizing: border-box;
        }
        footer > div {
          width: 100% !important;
          max-width: 1200px !important; 
          margin: 0 auto !important; 
        }
      `}</style>

      {/* ROOT FULLSCREEN CONTAINER */}
      <div style={{
        height: "100vh",
        width: "100%",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box"
      }}>

        {/* MAIN GRID LAYOUT */}
        <div style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 640px",
          width: "100%",
          overflow: "hidden"
        }}>

          {/* ── SEKSI KIRI: HERO BANNER & STORY STACK ── */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 60, left: 60 }}>
              <img
                src={LogoInstagram}
                alt="Instagram"
                style={{ width: 75, height: 75, objectFit: "contain" }}
                onError={(e) => { e.currentTarget.style.display = "none" }}
              />
            </div>

            <h1 style={{
              fontSize: "60px",
              fontWeight: 400,
              color: "#000000",
              lineHeight: 1.25,
              textAlign: "center",
              marginBottom: "40px",
              letterSpacing: "-0.5px"
            }}>
              See everyday moments from your <br />
              <span className="gradient-text">close friends</span>.
            </h1>

            <div style={{ position: "relative", width: "560px", height: "450px", marginTop: "10px" }}>
              {/* Gambar Kiri */}
              <div style={{
                position: "absolute", width: "215px", height: "340px",
                left: "10px", bottom: "10px", transform: "rotate(-12deg)", zIndex: 10,
                borderRadius: "24px", overflow: "hidden", boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
              }}>
                <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, width: 28, height: 28, background: "#ff3040", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>❤️</div>
              </div>

              {/* Gambar Tengah */}
              <div style={{
                position: "absolute", width: "265px", height: "410px",
                left: "50%", transform: "translateX(-50%)", top: "0px", zIndex: 30,
                borderRadius: "28px", overflow: "hidden", border: "4px solid white",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}>
                <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.9)", padding: "4px 10px", borderRadius: "999px", display: "flex", gap: "4px", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <span>🔮</span><span>👀</span><span>🤯</span>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ height: 10, width: 80, borderRadius: 999, background: "rgba(255,255,255,0.8)" }} />
                  <span style={{ color: "white", fontSize: 18 }}>❤️</span>
                </div>
              </div>

              {/* Gambar Kanan */}
              <div style={{
                position: "absolute", width: "215px", height: "340px",
                right: "10px", bottom: "20px", transform: "rotate(10deg)", zIndex: 20,
                borderRadius: "24px", overflow: "hidden", boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
              }}>
                <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 12, right: 12, width: 26, height: 26, background: "#00de65", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", fontWeight: "bold" }}>★</div>
              </div>
            </div>
          </div>

          {/* ── SEKSI KANAN: FORM PANEL LOGIN ── */}
          <div style={{
            borderLeft: "1px solid #dbdbdb",
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 50px",
            boxSizing: "border-box",
            height: "100%"
          }}>
            <div style={{ width: "100%", maxWidth: "540px", display: "flex", flexDirection: "column" }}>

              <h2 style={{ textAlign: "left", fontSize: "20px", fontWeight: 600, color: "#1f2937", marginBottom: "24px", paddingLeft: "4px" }}>
                Log into Instagram
              </h2>

              <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Email - Floating Label */}
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    disabled={isLoading}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="custom-input"
                  />
                  <label htmlFor="email">Email address</label>
                </div>

                {/* Password - Floating Label */}
                <div className="input-wrapper" style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    className="custom-input"
                    style={{ paddingRight: "56px" }}
                  />
                  <label htmlFor="password">Password</label>
                  {password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute", right: 16, padding: "4px",
                        background: "transparent", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280"
                      }}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                {/* Tombol Login — Sekarang terkunci otomatis jika password < 6 karakter */}
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              <button type="button" style={{
                fontSize: "14px", fontWeight: 500, color: "#1f2937", background: "transparent",
                border: "none", cursor: "pointer", marginTop: "20px", marginBottom: "40px",
                textAlign: "center", paddingLeft: "4px"
              }}>
                Forgot password?
              </button>

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", marginTop: "auto" }}>
                <button
                  type="button"
                  onClick={() => {
                    setTimeout(() => {
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                      window.location.href = `${apiUrl}/auth/login`;
                    }, 300);
                  }}
                  className="btn-google-login"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    alt="Google Icon"
                    style={{ width: "20px", height: "20px" }}
                  />
                  Log in with Google
                </button>

                <Link to="/register" className="btn-outline-blue">
                  Create new account
                </Link>
              </div>

              {/* BRANDING META */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
                <img
                  src={LogoMeta}
                  alt="Meta Logo"
                  style={{ width: "24px", height: "auto", objectFit: "contain" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151", letterSpacing: "0.05em" }}>Meta</span>
              </div>

            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer style={{
          width: "100%",
          background: "#ffffff",
          padding: "100px 0",
          boxSizing: "border-box",
          borderTop: "1px solid #f1f1f1"
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",width :"100%", marginTop: "-12px", justifyContent: "flex-start", boxSizing: "border-box", padding: "0 20px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 16px", width: "100%", maxWidth: "1200px" }}>
              {["Meta", "About", "Blog", "Jobs", "Help", "API", "Privacy", "Terms", "Locations", "Popular", "Instagram Lite", "Meta AI", "Threads", "Contact Uploading & Non-Users", "Meta Verified", "Meta in indonesia"].map((item) => (
                <a key={item} href="#" style={{ fontSize: "12px", color: "#737373", textDecoration: "none" }}>
                  {item}
                </a>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", fontSize: "12px", color: "#737373" }}>
              <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    defaultValue="en"
                    style={{
                      fontSize: "12px", color: "#737373", background: "transparent",
                      border: "none", paddingRight: "14px", cursor: "pointer", outline: "none",
                      appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
                      width: "auto", margin: 0
                    }}
                    onChange={(e) => { console.log("Bahasa diganti ke:", e.target.value); }}
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
                    style={{ 
                      pointerEvents: "none", 
                      position: "absolute", 
                      right: "0px", 
                      top: "50%", 
                      transform: "translateY(-50%)" 
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <span style={{ marginLeft: "8px" }}>© 2026 Instagram from Meta</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}