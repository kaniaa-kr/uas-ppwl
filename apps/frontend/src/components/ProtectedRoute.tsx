import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

// Definisikan tipe data untuk props children agar TypeScript tidak protes
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Mengambil status autentikasi dari Zustand store kamu
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Jika user BELUM login, tendang balik mereka secara paksa ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika user SUDAH login, loloskan dan tampilkan halaman yang mereka tuju (children)
  return <>{children}</>;
}