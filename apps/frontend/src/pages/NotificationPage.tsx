import { useState } from "react"
import NotificationItem from "../components/NotificationItem"
import type { Notification } from "../stores/notification.store"

const dummyNotifications: Notification[] = [
  {
    id: "1",
    user_id: "99",
    actor_id: "1",
    type: "like",
    post_id: "10",
    comment_id: null,
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    actor: { id: "1", name: "Budi Santoso", username: "budi_s", avatar_url: null },
    post: { id: "10", content: "Sunset di pantai Bali 🌅", image_url: null },
  },
  {
    id: "2",
    user_id: "99",
    actor_id: "2",
    type: "comment",
    post_id: "10",
    comment_id: "5",
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actor: { id: "2", name: "Siti Rahayu", username: "siti_r", avatar_url: null },
    post: { id: "10", content: "Sunset di pantai Bali 🌅", image_url: null },
  },
  {
    id: "3",
    user_id: "99",
    actor_id: "3",
    type: "like",
    post_id: "11",
    comment_id: null,
    is_read: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { id: "3", name: "Andi Wijaya", username: "andi_w", avatar_url: null },
    post: { id: "11", content: "Makan siang enak hari ini 🍜", image_url: null },
  },
  {
    id: "4",
    user_id: "99",
    actor_id: "4",
    type: "comment",
    post_id: "11",
    comment_id: "6",
    is_read: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { id: "4", name: "Dewi Lestari", username: "dewi_l", avatar_url: null },
    post: { id: "11", content: "Makan siang enak hari ini 🍜", image_url: null },
  },
  {
    id: "5",
    user_id: "99",
    actor_id: "5",
    type: "like",
    post_id: "12",
    comment_id: null,
    is_read: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { id: "5", name: "Raka Pratama", username: "raka_p", avatar_url: null },
    post: { id: "12", content: "Foto bareng teman-teman 📸", image_url: null },
  },
]

type FilterType = "semua" | "like" | "comment"

function getGroup(createdAt: string): "Hari ini" | "Minggu ini" | "Lebih Awal" {
  const diff = Date.now() - new Date(createdAt).getTime()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 1) return "Hari ini"
  if (days < 7) return "Minggu ini"
  return "Lebih Awal"
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications)
  const [filter, setFilter] = useState<FilterType>("semua")

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const filtered = notifications.filter((n) => {
    if (filter === "semua") return true
    return n.type === filter
  })

  const groups: ("Hari ini" | "Minggu ini" | "Lebih Awal")[] = [
    "Hari ini",
    "Minggu ini",
    "Lebih Awal",
  ]

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const tabs: { label: string; value: FilterType }[] = [
    { label: "Semua", value: "semua" },
    { label: "Like", value: "like" },
    { label: "Komentar", value: "comment" },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] lg:ml-[244px] xl:ml-[335px]">
      {/* mobile top spacing */}
      <div className="h-[54px] lg:hidden" />

      <div className="max-w-[600px] mx-auto px-4 pt-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <h1 className="text-base font-semibold text-[#262626]">Notifikasi</h1>
          {unreadCount > 0 && (
            <span className="bg-[#ff3040] text-white text-[10px] font-bold rounded-full px-[7px] py-[1px] leading-none">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Filter pill tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-[7px] rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                filter === tab.value
                  ? "bg-[#262626] text-white border-[#262626]"
                  : "bg-white text-[#262626] border-[#dbdbdb] hover:bg-[#f0f0f0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grouped notification list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-[#262626] font-semibold">Belum ada notifikasi</p>
            <p className="text-sm text-[#737373]">Aktivitas dari orang lain akan muncul di sini.</p>
          </div>
        ) : (
          groups.map((group) => {
            const items = filtered.filter((n) => getGroup(n.created_at) === group)
            if (items.length === 0) return null
            return (
              <div key={group} className="mb-5">
                <h2 className="text-xs font-semibold text-[#737373] mb-2 uppercase tracking-wide">
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

      {/* mobile bottom spacing */}
      <div className="h-[49px] lg:hidden" />
    </div>
  )
}
