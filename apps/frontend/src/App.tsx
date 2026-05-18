import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import PostDetailPage from "./pages/PostDetailPage"
import NotificationPage from "./pages/NotificationPage"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuthStore } from "./stores/auth.store"

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      
      {/* Navbar hanya muncul jika user sudah login */}
      {isAuthenticated && <Navbar />}
      
      <Routes>
        {/* Mengikuti panduan: /login dan /register tidak di-guard secara ketat di sini */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rute utama yang dilindungi menggunakan ProtectedRoute sesuai panduan */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />

        {/* Jaga-jaga jika mengetik rute asal-asalan, lempar ke beranda */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}