import type { Notification } from "../stores/notification.store"

type Props = {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}j`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}h`
  return `${Math.floor(days / 7)}mgg`
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: Props) {
  const { id, type, actor, post, created_at, is_read } = notification

  const initials = actor.name
    ? actor.name.substring(0, 2).toUpperCase()
    : "US"

  const message =
    type === "like"
      ? "menyukai postingan Anda."
      : "mengomentari postingan Anda."

  return (
    <div
      onClick={() => onMarkAsRead(id)}
      className={`flex items-center gap-[14px] px-2 py-3 cursor-pointer transition-colors hover:bg-[#fafafa] rounded-[8px] ${
        !is_read ? "bg-white" : "bg-white"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-[44px] h-[44px] rounded-full overflow-hidden bg-[#e0e0e0] flex items-center justify-center cursor-pointer">
          {actor.avatar_url ? (
            <img
              src={actor.avatar_url}
              alt={actor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[14px] font-semibold text-[#737373]">{initials}</span>
          )}
        </div>
      </div>

      {/* Text Content */}
      <div className="flex-1 text-left min-w-0 flex items-center flex-wrap gap-1">
        <p className="text-[14px] text-[#262626] leading-snug">
          <span className="font-semibold cursor-pointer">{actor.username}</span>{" "}
          {message}{" "}
          {post && type === "comment" && (
            <span className="text-[#737373]">"{post.content.slice(0, 30)}…" </span>
          )}
          <span className="text-[14px] text-[#737373]">{timeAgo(created_at)}</span>
        </p>
      </div>

      {/* Post thumbnail or unread dot */}
      {post?.image_url ? (
        <img
          src={post.image_url}
          alt=""
          className="w-[44px] h-[44px] object-cover flex-shrink-0 rounded-sm cursor-pointer"
        />
      ) : !is_read ? (
        <div className="w-2.5 h-2.5 rounded-full bg-[#0095f6] flex-shrink-0 ml-2" />
      ) : null}
    </div>
  )
}
