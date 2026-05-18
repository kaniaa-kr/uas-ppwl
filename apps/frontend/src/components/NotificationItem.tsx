import { Notification } from "../stores/notification.store"

type NotificationItemProps = {
  notification: Notification
  onMarkAsRead?: (id: string) => void
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return "Baru saja"
    if (diffMins < 60) return `${diffMins} menit lalu`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} jam lalu`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} hari lalu`
    return date.toLocaleDateString("id-ID")
  }

  const message =
    notification.type === "like"
      ? "menyukai postingan kamu"
      : "mengomentari postingan kamu"

  return (
    <div
      className={`flex gap-3 rounded-lg p-3 border transition cursor-pointer hover:bg-gray-50 ${
        !notification.is_read ? "bg-blue-50 border-blue-100" : "bg-white"
      }`}
      onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
    >
      {/* Avatar actor */}
      <img
        src={
          notification.actor.avatar_url ||
          `https://ui-avatars.com/api/?name=${notification.actor.name}`
        }
        alt={notification.actor.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      {/* Konten notifikasi */}
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{notification.actor.name}</span>{" "}
          {message}
        </p>

        {/* Preview postingan */}
        {notification.post && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            "{notification.post.content}"
          </p>
        )}

        <p className="text-xs text-gray-400 mt-1">
          {formatDate(notification.created_at)}
        </p>
      </div>

      {/* Indikator belum dibaca */}
      {!notification.is_read && (
        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
      )}
    </div>
  )
}