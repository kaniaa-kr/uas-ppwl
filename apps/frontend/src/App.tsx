import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import ProtectedRoute from "./components/ProtectedRoute"

const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-screen">
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
        <Route path="/login" element={<LoginPage />} />
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
              <PlaceholderPage name="Detail Post" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="Notifikasi" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}