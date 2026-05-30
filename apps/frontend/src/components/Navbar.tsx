import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { useNotificationStore } from "../stores/notification.store"
import {
  Home,
  Search,
  PlusSquare,
  Bell,
  MessageCircle,
  LogOut,
  Clapperboard,
  // Menu,
} from "lucide-react"
import NotificationPanel from "./NotificationPanel"

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  const [showNotifPanel, setShowNotifPanel] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: "/", icon: Home, label: "Beranda" },
    { path: "/search", icon: Search, label: "Cari" },
    { path: "/create", icon: PlusSquare, label: "Buat" },
    { path: "/reels", icon: Clapperboard, label: "Reels" },
  ]

  return (
    <>
      {/* ── MOBILE TOP BAR ─────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-[60px] bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between z-40 select-none">
        <Link to="/" className="font-serif text-xl font-bold tracking-wider text-neutral-900 dark:text-neutral-50 hover:opacity-90">
          Instagram
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/messages"
            className={`p-1 relative transition-colors ${
              isActive("/messages")
                ? "text-neutral-950 dark:text-neutral-50"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            <MessageCircle size={24} strokeWidth={isActive("/messages") ? 2.5 : 1.5} />
          </Link>
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className={`p-1 relative transition-colors ${
              showNotifPanel || isActive("/notifications")
                ? "text-neutral-950 dark:text-neutral-50"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            <Bell size={24} strokeWidth={showNotifPanel ? 2.5 : 1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-black animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAVIGATION ──────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[52px] bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 px-6 flex items-center justify-between z-40 pb-[env(safe-area-inset-bottom)] select-none">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 transition-transform active:scale-90 ${
                active
                  ? "text-neutral-950 dark:text-neutral-50"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              <IconComponent size={24} strokeWidth={active ? 2.5 : 1.5} />
            </Link>
          )
        })}
        <Link
          to="/profile"
          className="p-1 transition-transform active:scale-90"
        >
          <div
            className={`w-[26px] h-[26px] rounded-full overflow-hidden border transition-colors ${
              isActive("/profile")
                ? "border-neutral-950 dark:border-neutral-50 ring-1 ring-neutral-950 dark:ring-neutral-50"
                : "border-neutral-200 dark:border-neutral-800"
            }`}
          >
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name ?? "U"
                )}&size=64&background=e0e0e0&color=757575`
              }
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </nav>

      {/* ── DESKTOP & TABLET SIDEBAR ─────────────────────────────── */}
      <aside className="hidden md:flex fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 flex-col py-8 px-3 transition-all duration-300 md:w-[72px] lg:w-[244px] select-none">
        {/* Logo Section */}
        <div className="px-3 mb-10 h-10 flex items-center">
          <Link to="/" className="w-full">
            {/* Logo Text (Visible on big screens) */}
            <span className="hidden lg:block font-serif text-2xl font-bold tracking-wider text-neutral-900 dark:text-neutral-50">
              Instagram
            </span>
            {/* Minimalist Camera Icon alternative / dot for small layout responsive */}
            <span className="block lg:hidden text-xl font-bold text-neutral-900 dark:text-neutral-50 text-center mx-auto">
              IG
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group active:scale-95 ${
                  active
                    ? "font-bold text-neutral-950 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-900/50"
                    : "font-normal text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`}
              >
                <IconComponent
                  size={24}
                  strokeWidth={active ? 2.5 : 1.5}
                  className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                />
                <span className="hidden lg:block text-[15px] tracking-wide leading-none">
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* Notifikasi (Dengan panel toggle samping) */}
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 text-left group active:scale-95 ${
              showNotifPanel
                ? "font-bold text-neutral-950 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-900/50"
                : "font-normal text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <div className="relative flex-shrink-0">
              <Bell
                size={24}
                strokeWidth={showNotifPanel ? 2.5 : 1.5}
                className="group-hover:scale-105 transition-transform duration-200"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-black" />
              )}
            </div>
            <span className="hidden lg:block text-[15px] tracking-wide leading-none flex-1">
              Notifikasi
            </span>
            {unreadCount > 0 && (
              <span className="hidden lg:flex w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full items-center justify-center scale-90">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profil */}
          <Link
            to="/profile"
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group active:scale-95 ${
              isActive("/profile")
                ? "font-bold text-neutral-950 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-900/50"
                : "font-normal text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full overflow-hidden border flex-shrink-0 transition-colors ${
                isActive("/profile")
                  ? "border-neutral-950 dark:border-neutral-50 ring-1 ring-neutral-950 dark:ring-neutral-50"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              <img
                src={
                  user?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name ?? "U"
                  )}&size=64&background=e0e0e0&color=757575`
                }
                alt="profil"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden lg:block text-[15px] tracking-wide leading-none">
              Profil
            </span>
          </Link>

          {/* Keluar / Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-200 w-full text-left active:scale-95 mt-auto"
          >
            <LogOut size={24} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="hidden lg:block text-[15px] font-medium tracking-wide leading-none">
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* Notification Panel Container */}
      {showNotifPanel && (
        <NotificationPanel onClose={() => setShowNotifPanel(false)} />
      )}
    </>
  )
}