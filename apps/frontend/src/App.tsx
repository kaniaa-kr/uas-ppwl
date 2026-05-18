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
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Jika sudah login tapi coba buka /login, lempar balik ke beranda (/) */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route path="/register" element={<RegisterPage />} />
        
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