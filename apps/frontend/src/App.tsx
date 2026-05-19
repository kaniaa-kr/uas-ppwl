import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import HomePage from "./pages/HomePage"

// Halaman penampung sementara untuk fitur di luar tanggung jawab Anda
const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">🚧</h1>
      <p className="text-gray-500">
        Halaman {name} sedang disiapkan oleh tim lain
      </p>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Rute Beranda milik Anda - Terisolasi total dan aman dari error Auth */}
        <Route path="/" element={<HomePage />} />

        {/* Mengarahkan rute lain ke halaman penampung sementara */}
        <Route path="/login" element={<PlaceholderPage name="Login" />} />
        <Route path="/register" element={<PlaceholderPage name="Register" />} />
        <Route path="/post/:id" element={<PlaceholderPage name="Detail Postingan" />} />
        <Route path="/notifications" element={<PlaceholderPage name="Notifikasi" />} />
      </Routes>
    </BrowserRouter>
  )
}