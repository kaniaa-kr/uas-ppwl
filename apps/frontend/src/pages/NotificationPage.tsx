import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
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
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchNotifications = async () => {
    if (!user?.id || !token) {
      setLoading(false)
      return
    }
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

  useEffect(() => {
    fetchNotifications()
  }, [user?.id, token])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setLoading(true)
    await fetchNotifications()
    setIsRefreshing(false)
  }

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
    <div className="min-h-screen bg-white dark:bg-black text-neutral-950 dark:text-neutral-50 transition-colors duration-200">
      <Navbar />
      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0 min-h-screen">
        <div className="max-w-[600px] mx-auto px-4 py-4 md:py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-bold text-neutral-950 dark:text-neutral-50">Notifikasi</h1>
              {unreadCount > 0 && (
                <span className="bg-[#ff3040] text-white text-[11px] font-bold rounded-full px-2 py-[2px] leading-none">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 text-[#0095f6] text-[14px] font-semibold hover:text-[#00376b] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Perbarui
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {(["semua", "like", "comment"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-[6px] rounded-full text-[13px] font-semibold capitalize transition-colors ${
                  filter === f
                    ? "bg-neutral-950 dark:bg-neutral-50 text-white dark:text-neutral-900"
                    : "bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                }`}
              >
                {f === "semua" ? "Semua" : f === "like" ? "Suka" : "Komentar"}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-800 border-t-neutral-400 animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-neutral-950 dark:text-neutral-50 font-semibold text-xl mt-4">Belum ada notifikasi</p>
              <p className="text-[14px] text-neutral-500 dark:text-neutral-400">
                Aktivitas dari orang lain akan muncul di sini.
              </p>
            </div>
          )}

          {/* Grouped List */}
          {!loading && groups.map((group) => {
            const items = filtered.filter((n) => getGroup(n.created_at) === group)
            if (items.length === 0) return null
            return (
              <div key={group} className="mb-5">
                <h2 className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-widest px-1">
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