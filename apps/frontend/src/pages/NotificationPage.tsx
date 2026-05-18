import { useEffect } from "react"
import { useAuthStore } from "../stores/auth.store"
import { useNotificationStore } from "../stores/notification.store"
import NotificationItem from "../components/NotificationItem"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function NotificationPage() {
  const { user } = useAuthStore()
  const { notifications, setNotifications, markAsRead } =
    useNotificationStore()

  // Ambil notifikasi dari backend
  const fetchNotifications = async () => {
    if (!user) return
    try {
      const res = await fetch(`${API_URL}/notifications/${user.id}`)
      const data = await res.json()
      setNotifications(data)
    } catch (err) {
      console.error("Gagal ambil notifikasi:", err)
    }
  }

  // Mark as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
      })
      markAsRead(id)
    } catch (err) {
      console.error("Gagal mark as read:", err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [user])

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Notifikasi</h1>
        <button
          onClick={fetchNotifications}
          className="text-sm text-blue-500 hover:text-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* List notifikasi */}
      {notifications.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p>Belum ada notifikasi</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}