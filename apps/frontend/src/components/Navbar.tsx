import { useState } from "react"
import { Home, Bell, Film, Compass, MessageCircle, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useNotificationStore } from "../stores/notification.store"
import { useAuthStore } from "../stores/auth.store"
import NotificationPanel from "./NotificationPanel"

export default function Navbar() {
  const location = useLocation()
  const { unreadCount } = useNotificationStore()
  const { user, logout } = useAuthStore()
  const [showNotif, setShowNotif] = useState(false)

  const navItems = [
    { icon: Home, label: "Beranda", to: "/" },
    { icon: Compass, label: "Jelajahi", to: "/explore" },
    { icon: Film, label: "Reels", to: "/reels" },
    { icon: MessageCircle, label: "Pesan", to: "/messages" },
  ]

  const sidebarWidth = showNotif ? "w-20" : "w-64"

  return (
    <>
      {/* Sidebar kiri */}
      <aside
        className={`fixed top-0 left-0 h-screen ${sidebarWidth} border-r bg-white flex flex-col px-3 py-6 z-40 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="px-3 mb-8 overflow-hidden">
          {showNotif ? (
            <span className="font-bold text-xl">📷</span>
          ) : (
            <span className="font-bold text-xl"></span>
          )}
        </div>

        {/* Menu navigasi */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 transition text-sm font-medium ${
                location.pathname === to ? "font-bold" : ""
              }`}
            >
              <Icon size={24} className="flex-shrink-0" />
              {!showNotif && <span>{label}</span>}
            </Link>
          ))}

          {/* Tombol Notifikasi */}
          <button
            onClick={() => setShowNotif((prev) => !prev)}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 transition text-sm font-medium w-full text-left ${
              showNotif ? "bg-gray-100 font-bold" : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            {!showNotif && <span>Notifikasi</span>}
          </button>
        </nav>

        {/* Avatar & Logout di bawah */}
        <div className="mt-auto flex flex-col gap-2 px-3">
          <Link
            to="/profile"
            className="flex items-center gap-3 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <User size={24} className="flex-shrink-0" />
            )}
            {!showNotif && (
              <span className="text-sm font-medium">{user?.name ?? "Profil"}</span>
            )}
          </Link>
          {!showNotif && (
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-700 text-left px-1"
            >
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* Panel Notifikasi */}
      {showNotif && (
        <NotificationPanel onClose={() => setShowNotif(false)} />
      )}
    </>
  )
}