import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import NotificationItem from "../components/NotificationItem"
import { useNotificationStore } from "../stores/notification.store"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

type FilterType = "semua" | "like" | "comment"

function getGroup(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "Hari Ini"
  if (days === 1) return "Kemarin"
  if (days <= 7) return "Minggu Ini"
  if (days <= 30) return "Bulan Ini"
  return "Terdahulu"
}

export default function NotificationPage() {
  const notifications = useNotificationStore((s) => s.notifications)
  const setNotifications = useNotificationStore((s) => s.setNotifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const [filter, setFilter] = useState<FilterType>("semua")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id || !token) {
      setLoading(false)
      return
    }
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/notifications/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setNotifications(data)
      } catch {
        toast.error("Gagal memuat notifikasi")
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [user?.id, token, setNotifications])

  const handleMarkAsRead = async (id: string) => {
    markAsRead(id)
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      // silently fail
    }
  }

  const filtered = notifications.filter((n) =>
    filter === "semua" ? true : n.type === filter
  )

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const groups = Array.from(
    new Set(filtered.map((n) => getGroup(n.created_at)))
  )

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0 min-h-screen bg-black">
        <div className="max-w-[600px] mx-auto px-4 py-4 md:py-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <h1 className="text-[22px] font-bold text-white">Notifikasi</h1>
            {unreadCount > 0 && (
              <span className="bg-[#ff3040] text-white text-[11px] font-bold rounded-full px-2 py-[2px] leading-none">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {(["semua", "like", "comment"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-[6px] rounded-full text-[13px] font-semibold capitalize transition-colors ${
                  filter === f
                    ? "bg-white text-black"
                    : "bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#262626] hover:text-white"
                }`}
              >
                {f === "semua" ? "Semua" : f === "like" ? "Suka" : "Komentar"}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-[#363636] border-t-[#737373] animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-[#363636] flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-white font-semibold text-xl mt-4">Belum ada notifikasi</p>
              <p className="text-[14px] text-[#737373]">
                Aktivitas dari orang lain akan muncul di sini.
              </p>
            </div>
          )}

          {/* Grouped List */}
          {!loading &&
            groups.map((group) => {
              const items = filtered.filter((n) => getGroup(n.created_at) === group)
              if (items.length === 0) return null
              return (
                <div key={group} className="mb-5">
                  <h2 className="text-[11px] font-semibold text-[#737373] mb-3 uppercase tracking-widest px-1">
                    {group}
                  </h2>
                  <div className="flex flex-col">
                    {items.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        notification={notif}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
