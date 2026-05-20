import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { Bell, LogOut, Home } from "lucide-react"
import { toast } from "sonner"

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success("Logout berhasil")
    navigate("/login")
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2 hover:opacity-75 transition"
        >
          📸 <span className="text-lg">InstaClone</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Home */}
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-500 transition"
            title="Beranda"
          >
            <Home size={24} />
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="text-gray-600 hover:text-red-500 transition relative"
            title="Notifikasi"
          >
            <Bell size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition">
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${user?.name}`
              }
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-semibold hidden sm:inline">
              {user?.name}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 transition"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}