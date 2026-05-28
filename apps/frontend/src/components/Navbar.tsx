import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { Bell, LogOut, Home, Search, PlusSquare, Compass, Film, MessageCircle } from "lucide-react"

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
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
    { to: "/reels", icon: Film, label: "Reels" },
  ]

  const LogoText = (
    <span
      className="text-[#262626] select-none leading-none tracking-normal"
      style={{
        fontFamily: "Billabong, 'Grand Hotel', cursive, Georgia, serif",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: "1.7rem",
      }}
    >
      Instagram
    </span>
  )

  return (
    <>
      {/* ═══ MOBILE: sticky top header ════════════════════════════════ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#dbdbdb] h-[48px] flex items-center justify-between px-4">
        {/* Logo wordmark */}
        <Link to="/" className="flex items-center">
          {LogoText}
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <Link
            to="/notifications"
            className="relative text-[#262626] hover:text-[#737373] transition-colors"
            aria-label="Notifikasi"
          >
            <Bell size={24} strokeWidth={isActive("/notifications") ? 2.5 : 1.5} fill={isActive("/notifications") ? "currentColor" : "none"} />
            <span className="absolute -top-[2px] -right-[2px] bg-[#ff3040] text-white text-[9px] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
              3
            </span>
          </Link>
          <Link
            to="/messages"
            className="text-[#262626] hover:text-[#737373] transition-colors"
            aria-label="Pesan"
          >
            <MessageCircle size={24} strokeWidth={isActive("/messages") ? 2.5 : 1.5} fill={isActive("/messages") ? "currentColor" : "none"} />
          </Link>
        </div>
      </header>

      {/* ═══ MOBILE: bottom navigation bar ═══════════════════════════ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#dbdbdb] flex items-center justify-around h-[48px] px-2 pb-[env(safe-area-inset-bottom)]">
        {mobileBottomItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className="flex items-center justify-center w-10 h-10 transition-transform active:scale-95"
          >
            <Icon
              size={24}
              strokeWidth={isActive(to) ? 2.5 : 1.5}
              fill={isActive(to) && to !== "/create" ? "currentColor" : "none"}
              className="text-[#262626]"
            />
          </Link>
        ))}
        {/* Profile avatar as last item */}
        <Link
          to="/profile"
          aria-label="Profil"
          className="flex items-center justify-center w-10 h-10 transition-transform active:scale-95"
        >
          <img
            src={
              user?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&size=64&background=e0e0e0&color=757575`
            }
            alt="avatar"
            className={`w-[24px] h-[24px] rounded-full object-cover ${
              isActive("/profile") ? "ring-1 ring-[#262626] ring-offset-1" : ""
            }`}
          />
        </Link>
      </nav>

      {/* ═══ DESKTOP: left sidebar ════════════════════════════════════ */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen z-50 bg-white border-r border-[#dbdbdb] w-[72px] lg:w-[244px] pt-4 pb-5 px-3">
        {/* Logo */}
        <div className="px-3 pt-5 pb-7 mb-2 flex items-center">
          <Link to="/" className="text-[#262626] hidden lg:block">
            {LogoText}
          </Link>
          <Link to="/" className="text-[#262626] lg:hidden hover:scale-105 transition-transform mx-auto">
             <div className="w-[24px] h-[24px] rounded-[5px] border-[1.5px] border-[#262626] flex items-center justify-center relative overflow-hidden">
               <div className="w-[10px] h-[10px] rounded-full border-[1.5px] border-[#262626]"></div>
               <div className="w-[3px] h-[3px] bg-[#262626] rounded-full absolute top-[3px] right-[3px]"></div>
             </div>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1">
          {desktopNavItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 p-3 rounded-lg group transition-colors hover:bg-[#f2f2f2] ${
                isActive(to) ? "font-bold text-[#262626]" : "text-[#262626]"
              }`}
            >
              {to === "/notifications" ? (
                <div className="relative mx-auto lg:mx-0">
                  <Icon
                    size={24}
                    strokeWidth={isActive(to) ? 2.5 : 1.5}
                    fill={isActive(to) ? "currentColor" : "none"}
                    className="group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -top-[2px] -right-[2px] bg-[#ff3040] text-white text-[9px] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                    3
                  </span>
                </div>
              ) : (
                <Icon
                  size={24}
                  strokeWidth={isActive(to) ? 2.5 : 1.5}
                  fill={isActive(to) && to !== "/create" ? "currentColor" : "none"}
                  className="mx-auto lg:mx-0 group-hover:scale-105 transition-transform"
                />
              )}
              <span className="hidden lg:block text-[15px]">{label}</span>
            </Link>
          ))}

          {/* Profile */}
          <Link
            to="/profile"
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-[#f2f2f2] ${
              isActive("/profile") ? "font-bold text-[#262626]" : "text-[#262626]"
            }`}
          >
            <div className="mx-auto lg:mx-0">
              <img
                src={
                  user?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&size=64&background=e0e0e0&color=757575`
                }
                alt="avatar"
                className={`w-[24px] h-[24px] rounded-full object-cover flex-shrink-0 group-hover:scale-105 transition-transform ${
                  isActive("/profile") ? "ring-1 ring-[#262626] ring-offset-1" : ""
                }`}
              />
            </div>
            <span className="hidden lg:block text-[15px]">Profil</span>
          </Link>
        </nav>

        {/* More Options / Logout */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-[#f2f2f2] transition-colors text-[#262626] group"
          >
            <LogOut size={24} strokeWidth={1.5} className="mx-auto lg:mx-0 group-hover:scale-105 transition-transform" />
            <span className="hidden lg:block text-[15px]">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  )
}
