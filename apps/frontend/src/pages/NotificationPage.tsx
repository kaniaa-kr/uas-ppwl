import { useState } from "react"
import Navbar from "../components/Navbar"
import NotificationItem from "../components/NotificationItem"
import type { Notification } from "../stores/notification.store"
import { useNotificationStore } from "../stores/notification.store"

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
  const markAsRead = useNotificationStore((s) => s.markAsRead)

  const [filter, setFilter] = useState<FilterType>("semua")

  const filtered = notifications.filter((n) =>
    filter === "semua" ? true : n.type === filter
  )

  const unreadCount = notifications.filter((n) => !n.is_read).length

  // unique groups based on filtered
  const groups = Array.from(
    new Set(filtered.map((n) => getGroup(n.created_at)))
  )

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0 min-h-screen bg-white">
        <div className="max-w-[600px] mx-auto px-4 py-[16px] md:py-[32px]">
          {/* Header */}
          <div className="flex items-center gap-[10px] mb-6">
            <h1 className="text-[24px] font-bold text-[#262626]">Notifikasi</h1>
            {unreadCount > 0 && (
              <span className="bg-[#ff3040] text-white text-[12px] font-bold rounded-full px-[8px] py-[2px] leading-none">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Grouped List */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-[#262626] flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-[#262626] font-semibold text-xl mt-4">Belum ada notifikasi</p>
              <p className="text-[14px] text-[#737373]">Aktivitas dari orang lain akan muncul di sini.</p>
            </div>
          ) : (
            groups.map((group) => {
              const items = filtered.filter((n) => getGroup(n.created_at) === group)
              if (items.length === 0) return null
              return (
                <div key={group} className="mb-4">
                  <h2 className="text-[16px] font-bold text-[#262626] mb-[12px]">
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
            })
          )}
        </div>
      </div>
    </div>
  )
}
