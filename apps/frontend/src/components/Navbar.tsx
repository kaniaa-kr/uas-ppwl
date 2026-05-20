import { Home, Bell, User, LogOut } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#DBDBDB] bg-[#FFFFFF] h-16">
      <div className="max-w-4xl mx-auto h-full px-4 flex items-center justify-between">

        {/* LOGO BRAND */}
        <h1 className="text-xl font-bold text-[#262626] tracking-tight cursor-pointer select-none">
          Instagram Clone
        </h1>

        {/* NAVIGASI MENU (Sesuai spesifikasi tugas Evan) */}
        <div className="flex items-center space-x-5 sm:space-x-6">
          {/* Menu Home */}
          <button
            title="Home"
            className="text-[#262626] hover:text-gray-400 transition-colors cursor-pointer"
          >
            <Home size={24} />
          </button>

          {/* Menu Notification */}
          <button
            title="Notifications"
            className="text-[#262626] hover:text-gray-400 transition-colors cursor-pointer relative"
          >
            <Bell size={24} />
            {/* Catatan: Badge jumlah unread adalah tugas Sidiq, kita cukup siapkan icon-nya */}
          </button>

          {/* User Menu */}
          <button
            title="Profile Menu"
            className="text-[#262626] hover:text-gray-400 transition-colors cursor-pointer"
          >
            <User size={24} />
          </button>

          {/* Logout */}
          <button
            title="Logout"
            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <LogOut size={24} />
          </button>
        </div>

      </div>
    </nav>
  )
}