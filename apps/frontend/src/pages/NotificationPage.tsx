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
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Notifikasi</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount} baru
            </span>
          )}
        </div>
      </div>

      {/* Filter Tab */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === tab.value
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grouped List */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p>Belum ada notifikasi</p>
        </div>
      ) : (
        groups.map((group) => {
          const items = filtered.filter((n) => getGroup(n.created_at) === group)
          if (items.length === 0) return null
          return (
            <div key={group} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">{group}</h2>
              <div className="flex flex-col gap-2">
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
  )
}