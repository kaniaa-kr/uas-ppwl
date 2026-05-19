import type { Notification } from "../stores/notification.store"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "baru saja"
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  const weeks = Math.floor(days / 7)
  return `${weeks} minggu lalu`
}

type Props = {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

export default function NotificationItem({ notification, onMarkAsRead }: Props) {
  const { actor, type, post, is_read, created_at, id } = notification

  const initials = actor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const message =
    type === "like"
      ? "menyukai postingan kamu."
      : "mengomentari postingan kamu."

  return (
    <div
      onClick={() => onMarkAsRead(id)}
      className={`flex items-center gap-3 px-2 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition ${
        !is_read ? "bg-blue-50" : ""
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
        {actor.avatar_url ? (
          <img
            src={actor.avatar_url}
            alt={actor.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Teks */}
      <div className="flex-1 text-sm">
        <span className="font-semibold">{actor.username}</span>{" "}
        <span className="text-gray-700">{message}</span>
        {post && (
          <span className="text-gray-400"> "{post.content.slice(0, 30)}..."</span>
        )}
        <div className="text-xs text-gray-400 mt-0.5">{timeAgo(created_at)}</div>
      </div>

      {/* Indikator belum dibaca */}
      {!is_read && (
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
      )}
    </div>
  )
}