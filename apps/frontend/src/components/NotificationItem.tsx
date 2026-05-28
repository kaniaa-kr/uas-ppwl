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
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors hover:bg-[#f9f9f9] rounded-sm ${
        !is_read ? "bg-[#eff7ff]" : "bg-white"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-[#e0e0e0] flex items-center justify-center">
          {actor.avatar_url ? (
            <img
              src={actor.avatar_url}
              alt={actor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-[#737373]">{initials}</span>
          )}
        </div>
        {/* type badge */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] ${
            type === "like" ? "bg-[#ff3040]" : "bg-[#0095f6]"
          }`}
        >
          {type === "like" ? "❤️" : "💬"}
        </span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#262626] leading-snug">
          <span className="font-semibold">{actor.username}</span>{" "}
          <span>{message}</span>
          {post && (
            <span className="text-[#737373]"> "{post.content.slice(0, 30)}…"</span>
          )}
        </p>
        <p className="text-xs text-[#737373] mt-[3px]">{timeAgo(created_at)}</p>
      </div>

      {/* Post thumbnail or unread dot */}
      {post?.image_url ? (
        <img
          src={post.image_url}
          alt=""
          className="w-11 h-11 object-cover flex-shrink-0 rounded-sm"
        />
      ) : !is_read ? (
        <div className="w-2.5 h-2.5 rounded-full bg-[#0095f6] flex-shrink-0" />
      ) : null}
    </div>
  )
}
