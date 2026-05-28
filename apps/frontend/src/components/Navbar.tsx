import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { Bell, LogOut, Home, Search, PlusSquare, Compass, Film, MessageCircle } from "lucide-react"
import { toast } from "sonner"

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success("Logout berhasil")
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path

  const desktopNavItems = [
    { to: "/", icon: Home, label: "Beranda" },
    { to: "/search", icon: Search, label: "Cari" },
    { to: "/explore", icon: Compass, label: "Jelajahi" },
    { to: "/reels", icon: Film, label: "Reels" },
    { to: "/messages", icon: MessageCircle, label: "Pesan" },
    { to: "/notifications", icon: Bell, label: "Notifikasi" },
    { to: "/create", icon: PlusSquare, label: "Buat" },
  ]

  const mobileBottomItems = [
    { to: "/", icon: Home, label: "Beranda" },
    { to: "/search", icon: Search, label: "Cari" },
    { to: "/create", icon: PlusSquare, label: "Buat" },
    { to: "/explore", icon: Compass, label: "Jelajahi" },
  ]

  return (
    <>
      {/* ═══ MOBILE: sticky top header ════════════════════════════════ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#dbdbdb] h-[54px] flex items-center justify-between px-4">
        {/* Logo wordmark */}
        <Link
          to="/"
          className="text-[#262626] select-none leading-none"
          style={{
            fontFamily: "Billabong, Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "1.6rem",
          }}
        >
          Instagram
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <Link
            to="/notifications"
            className="relative text-[#262626] hover:text-[#737373] transition-colors"
            aria-label="Notifikasi"
          >
            <Bell size={24} strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-1.5 bg-[#ff3040] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
              3
            </span>
          </Link>
          <Link
            to="/messages"
            className="text-[#262626] hover:text-[#737373] transition-colors"
            aria-label="Pesan"
          >
            <MessageCircle size={24} strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      {/* ═══ MOBILE: bottom navigation bar ═══════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#dbdbdb] flex items-center justify-around h-[49px] px-2">
        {mobileBottomItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className={`flex items-center justify-center w-10 h-10 transition-opacity ${
              isActive(to) ? "opacity-100" : "opacity-60 hover:opacity-90"
            }`}
          >
            <Icon
              size={26}
              strokeWidth={isActive(to) ? 2.2 : 1.5}
              fill={isActive(to) && to !== "/create" ? "currentColor" : "none"}
              className="text-[#262626]"
            />
          </Link>
        ))}
        {/* Profile avatar as last item */}
        <Link
          to="/profile"
          aria-label="Profil"
          className={`flex items-center justify-center w-10 h-10 ${
            isActive("/profile") ? "opacity-100" : "opacity-60 hover:opacity-90"
          }`}
        >
          <img
            src={
              user?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&size=64&background=e0e0e0&color=757575`
            }
            alt="avatar"
            className={`w-7 h-7 rounded-full object-cover ${
              isActive("/profile") ? "ring-2 ring-[#262626] ring-offset-1" : ""
            }`}
          />
        </Link>
      </nav>

      {/* ═══ DESKTOP: left sidebar ════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-50 bg-white border-r border-[#dbdbdb] w-[244px] xl:w-[335px] pt-2 pb-5 px-3">
        {/* Logo */}
        <div className="px-3 py-5 mb-3">
          <Link
            to="/"
            className="text-[#262626] select-none leading-none"
            style={{
              fontFamily: "Billabong, Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "1.8rem",
            }}
          >
            Instagram
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {desktopNavItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl group transition-colors ${
                isActive(to)
                  ? "font-semibold text-[#262626]"
                  : "text-[#262626] hover:bg-[#f0f0f0]"
              }`}
            >
              {to === "/notifications" ? (
                <span className="relative">
                  <Icon
                    size={26}
                    strokeWidth={isActive(to) ? 2.2 : 1.5}
                    fill={isActive(to) ? "currentColor" : "none"}
                  />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff3040] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    3
                  </span>
                </span>
              ) : (
                <Icon
                  size={26}
                  strokeWidth={isActive(to) ? 2.2 : 1.5}
                  fill={isActive(to) && to !== "/create" ? "currentColor" : "none"}
                />
              )}
              <span className={`text-sm ${isActive(to) ? "font-semibold" : "font-normal"}`}>
                {label}
              </span>
            </Link>
          ))}

          {/* Profile */}
          <Link
            to="/profile"
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${
              isActive("/profile")
                ? "font-semibold text-[#262626]"
                : "text-[#262626] hover:bg-[#f0f0f0]"
            }`}
          >
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&size=64&background=e0e0e0&color=757575`
              }
              alt="avatar"
              className={`w-7 h-7 rounded-full object-cover flex-shrink-0 ${
                isActive("/profile") ? "ring-2 ring-[#262626] ring-offset-1" : ""
              }`}
            />
            <span className={`text-sm ${isActive("/profile") ? "font-semibold" : "font-normal"}`}>
              Profil
            </span>
          </Link>
        </nav>

        {/* Bottom: logout + user info */}
        <div className="mt-auto pt-3 border-t border-[#dbdbdb]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f0f0f0] transition-colors">
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&size=64&background=e0e0e0&color=757575`
              }
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#262626] truncate leading-tight">
                {user?.username}
              </p>
              <p className="text-xs text-[#737373] truncate leading-tight">{user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="text-[#737373] hover:text-[#262626] transition-colors flex-shrink-0"
            >
              <LogOut size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
