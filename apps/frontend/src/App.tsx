import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import HomePage from "./pages/HomePage"
import PostDetailPage from "./pages/PostDetailPage"
import NotificationPage from "./pages/NotificationPage"
import Navbar from "./components/Navbar"

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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Navbar />
      <main className="ml-20 flex-1 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<PlaceholderPage name="Login" />} />
        <Route path="/register" element={<PlaceholderPage name="Register" />} />
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/post/:id" element={<Layout><PostDetailPage /></Layout>} />
        <Route path="/notifications" element={<Layout><NotificationPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}