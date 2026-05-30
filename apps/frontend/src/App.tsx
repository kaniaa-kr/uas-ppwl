import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import PostDetailPage from "./pages/PostDetailPage"
import NotificationPage from "./pages/NotificationPage"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"

const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="min-h-screen bg-[#fafafa]">
    <Navbar />
    <div className="lg:ml-[244px] xl:ml-[335px] flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center bg-white border border-[#dbdbdb] p-10 rounded-sm">
        <h1 className="text-4xl mb-4">🚧</h1>
        <h2 className="text-xl font-semibold text-[#262626] mb-2">{name}</h2>
        <p className="text-sm text-[#737373]">
          Halaman ini sedang dalam tahap pengembangan
        </p>
      </div>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Main Routes */}
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

        {/* Placeholder Routes for Navbar items */}
        <Route path="/search" element={<ProtectedRoute><PlaceholderPage name="Pencarian" /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><PlaceholderPage name="Jelajahi" /></ProtectedRoute>} />
        <Route path="/reels" element={<ProtectedRoute><PlaceholderPage name="Reels" /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><PlaceholderPage name="Pesan" /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><PlaceholderPage name="Buat Postingan" /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PlaceholderPage name="Profil Pengguna" /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}