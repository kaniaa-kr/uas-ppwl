import type { Notification } from "../stores/notification.store"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()

  const handleClick = () => {
    onMarkAsRead(id)
    if (post?.id) navigate(`/post/${post.id}`)
    else navigate(`/profile/${actor.username}`)
  }

  const initials = actor.name
    ? actor.name.substring(0, 2).toUpperCase()
    : "US"

  const message =
    type === "like"
      ? "menyukai postingan Anda."
      : "mengomentari postingan Anda."

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 px-3 py-3 cursor-pointer rounded-xl transition-colors hover:bg-[#1a1a1a] ${
        !is_read ? "border-l-2 border-[#0095f6] pl-[10px]" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/profile/${actor.username}`)
          }}
          className="w-11 h-11 rounded-full overflow-hidden bg-[#262626] flex items-center justify-center cursor-pointer"
        >
          {actor.avatar_url ? (
            <img
              src={actor.avatar_url}
              alt={actor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[13px] font-semibold text-[#a0a0a0]">
              {initials}
            </span>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-[#d4d4d4] leading-snug">
          <span
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/profile/${actor.username}`)
            }}
            className="font-semibold text-white cursor-pointer hover:underline"
          >
            {actor.username}
          </span>{" "}
          {message}{" "}
          {post && type === "comment" && (
            <span className="text-[#737373]">
              "{post.content.slice(0, 30)}…"{" "}
            </span>
          )}
          <span className="text-[#737373] text-[12px]">{timeAgo(created_at)}</span>
        </p>
      </div>

      {/* Thumbnail or unread dot */}
      {post?.image_url ? (
        <img
          src={post.image_url}
          alt=""
          className="w-11 h-11 object-cover flex-shrink-0 rounded-md cursor-pointer"
        />
      ) : !is_read ? (
        <div className="w-2 h-2 rounded-full bg-[#0095f6] flex-shrink-0 ml-1" />
      ) : null}
    </div>
  )
}
