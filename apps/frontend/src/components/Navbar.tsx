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
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#262626] h-[48px] flex items-center justify-between px-4">
        {/* Logo */}
        <span
          className="text-white text-[28px] leading-none select-none"
          style={{ fontFamily: "Billabong, 'Grand Hotel', cursive", fontStyle: "italic" }}
        >
          Insuta
        </span>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Bell */}
          <button
            className="relative text-white"
            onClick={() => setShowNotifPanel((v) => !v)}
            aria-label="Notifikasi"
          >
            <Bell size={24} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff3040] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* DM */}
          <button className="text-white" aria-label="Pesan">
            <MessageCircle size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAV ──────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#262626] h-[48px] flex items-center">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            aria-label={label}
            className={`flex-1 flex items-center justify-center h-full transition-colors ${
              isActive(path) ? "text-white" : "text-[#737373]"
            }`}
          >
            <Icon
              size={path === "/create" ? 28 : 24}
              strokeWidth={isActive(path) ? 2.5 : 1.5}
              fill={isActive(path) && path === "/" ? "currentColor" : "none"}
            />
          </Link>
        ))}

        {/* Profile avatar */}
        <Link
          to="/profile"
          aria-label="Profil"
          className={`flex-1 flex items-center justify-center h-full`}
        >
          <div
            className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-colors ${
              isActive("/profile") ? "border-white" : "border-[#737373]"
            }`}
          >
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name ?? "U"
                )}&size=64&background=363636&color=ffffff`
              }
              alt="profil"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </nav>

      {/* ── DESKTOP LEFT SIDEBAR ───────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen bg-black border-r border-[#262626] z-50 w-[72px] lg:w-[244px] py-6 px-3 transition-all duration-200">
        {/* Logo */}
        <div className="mb-8 px-2 h-[32px] flex items-center overflow-hidden">
          {/* Collapsed: camera icon */}
          <span className="lg:hidden text-white">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="14" rx="3"/>
              <circle cx="12" cy="14" r="3"/>
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </span>
          {/* Expanded: wordmark */}
          <span
            className="hidden lg:block text-white text-[26px] leading-none select-none whitespace-nowrap"
            style={{ fontFamily: "Billabong, 'Grand Hotel', cursive", fontStyle: "italic" }}
          >
            Insuta
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors group ${
                isActive(path)
                  ? "text-white"
                  : "text-[#737373] hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              <Icon
                size={24}
                strokeWidth={isActive(path) ? 2.5 : 1.5}
                fill={isActive(path) && path === "/" ? "currentColor" : "none"}
                className="flex-shrink-0"
              />
              <span className="hidden lg:block text-[15px] font-medium leading-none">
                {label}
              </span>
            </Link>
          ))}

          {/* Notifications */}
          <button
            onClick={() => setShowNotifPanel((v) => !v)}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors w-full ${
              showNotifPanel
                ? "text-white"
                : "text-[#737373] hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            <div className="relative flex-shrink-0">
              <Bell size={24} strokeWidth={showNotifPanel ? 2.5 : 1.5} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff3040] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <span className="hidden lg:block text-[15px] font-medium leading-none">
              Notifikasi
            </span>
          </button>
        </nav>

        {/* Profile + Logout */}
        <div className="flex flex-col gap-1 mt-4">
          <Link
            to="/profile"
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${
              isActive("/profile")
                ? "text-white"
                : "text-[#737373] hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full overflow-hidden border-2 flex-shrink-0 transition-colors ${
                isActive("/profile") ? "border-white" : "border-[#737373]"
              }`}
            >
              <img
                src={
                  user?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name ?? "U"
                  )}&size=64&background=363636&color=ffffff`
                }
                alt="profil"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden lg:block text-[15px] font-medium leading-none">
              Profil
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-[#737373] hover:text-white hover:bg-[#1a1a1a] transition-colors w-full"
          >
            <LogOut size={24} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="hidden lg:block text-[15px] font-medium leading-none">
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* Notification Panel */}
      {showNotifPanel && (
        <NotificationPanel onClose={() => setShowNotifPanel(false)} />
      )}
    </>
  )
}
