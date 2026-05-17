import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { toast } from 'sonner';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
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
  // HANDLER LOGIN MANUAL (FORM)
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
    <div className="w-full max-w-110 bg-white p-8 md:border md:border-gray-200 rounded-sm flex flex-col items-center">
      {/* Logo Instagram */}
      <div className="mb-8 mt-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
          alt="Instagram Logo"
          className="w-20 h-20 object-contain"
        />
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-6 self-start pl-1">
        Log into Instagram
      </h2>

      {/* Form Login */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Input Username */}
        <div className="relative w-full">
          <input
            type="text"
            id="username"
            disabled={isLoading}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Mobile number, username, or email"
            className="w-full px-4 py-4 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:border-blue-500 placeholder-gray-400 bg-white disabled:opacity-50"
          />
        </div>

        {/* Input Password */}
        <div className="relative w-full flex items-center">
          <input
            type="text"
            id="password"
            disabled={isLoading}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              WebkitTextSecurity: showPassword ? 'none' : 'disc',
              MozTextSecurity: showPassword ? 'none' : 'disc',
            } as React.CSSProperties}
            className="w-full h-auto! px-5 pr-14 py-4 border border-gray-300 rounded-2xl text-[15px] focus:outline-none focus:border-blue-500 bg-white text-gray-800 placeholder-gray-400 box-border! disabled:opacity-50"
          />
          {password.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 p-1 text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer focus:outline-none flex items-center justify-center"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Tombol Log In */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-[#4796ec] hover:bg-blue-600 text-white font-semibold rounded-full text-sm transition duration-200 mt-2 disabled:opacity-70 flex justify-center items-center cursor-pointer"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      {/* Forgot Password */}
      <button type="button" className="text-sm font-medium text-gray-800 hover:underline mt-5 mb-10 bg-transparent border-none cursor-pointer">
        Forgot password?
      </button>

      {/* Tombol Pihak Ketiga */}
      <div className="w-full flex flex-col gap-3 mt-auto">
        {/* Tombol Log in dengan Google */}
        <button
          type="button"
          onClick={() => {
            // Menggunakan VITE_BACKEND_URL dinamis dari env
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
          }}
          className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 transition cursor-pointer"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google Icon"
            className="w-5 h-5"
          />
          Log in with Google
        </button>

        <button
          type="button"
          className="w-full py-3 border border-blue-500 rounded-full text-sm font-semibold text-blue-500 bg-white hover:bg-gray-50 transition cursor-pointer"
        >
          Create new account
        </button>
      </div>

      {/* Meta Footer */}
      <div className="mt-12 flex items-center gap-1 text-gray-500 font-medium text-xs">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-blue-500">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm2.25 14.5h-4.5V11.5h4.5v5zM12 10.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
        </svg>
        <span className="text-gray-700 font-semibold text-sm tracking-wide">Meta</span>
      </div>
    </div>
  );
}