import { useState } from "react"
import { X } from "lucide-react"
import NotificationItem from "./NotificationItem"
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
    post: { id: "10", content: "Sunset di pantai Bali", image_url: null },
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
    post: { id: "10", content: "Sunset di pantai Bali", image_url: null },
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
    post: { id: "11", content: "Makan siang enak hari ini", image_url: null },
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
    post: { id: "11", content: "Makan siang enak hari ini", image_url: null },
  },
]

function getGroup(createdAt: string): "Hari ini" | "Minggu ini" | "Lebih Awal" {
  const diff = Date.now() - new Date(createdAt).getTime()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 1) return "Hari ini"
  if (days < 7) return "Minggu ini"
  return "Lebih Awal"
}

type Props = {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications)

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const groups: ("Hari ini" | "Minggu ini" | "Lebih Awal")[] = [
    "Hari ini",
    "Minggu ini",
    "Lebih Awal",
  ]

  return (
    /* Positioned right of the sidebar (left: sidebar width) */
    <div className="fixed top-0 left-[244px] xl:left-[335px] h-screen w-[397px] bg-white border-r border-[#dbdbdb] z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#dbdbdb]">
        <h2 className="text-base font-semibold text-[#262626]">Notifikasi</h2>
        <button
          onClick={onClose}
          className="text-[#262626] hover:text-[#737373] transition-colors p-1 rounded-full hover:bg-[#f0f0f0]"
          aria-label="Tutup"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Notification list */}
      <div className="overflow-y-auto flex-1 py-2">
        {groups.map((group) => {
          const items = notifications.filter(
            (n) => getGroup(n.created_at) === group
          )
          if (items.length === 0) return null
          return (
            <div key={group} className="mb-4">
              <h3 className="text-xs font-semibold text-[#737373] px-6 py-2 uppercase tracking-wide">
                {group}
              </h3>
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
  )
}
