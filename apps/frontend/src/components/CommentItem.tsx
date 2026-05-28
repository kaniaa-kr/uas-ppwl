import { useState } from "react"
import { Heart } from "lucide-react"

type CommentItemProps = {
  id: string
  author: {
    name: string
    username: string
    avatar_url?: string
  }
  content: string
  createdAt: string
  parentId?: string | null
  onReply?: (commentId: string, username: string) => void
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

export default function CommentItem({
  id,
  author,
  content,
  createdAt,
  parentId,
  onReply,
}: CommentItemProps) {
  const [liked, setLiked] = useState(false)

  const displayName = author.username || author.name

  return (
    <div
      className={`flex items-start gap-[14px] py-[8px] ${
        parentId ? "ml-[46px]" : ""
      }`}
    >
      {/* Avatar */}
      <img
        src={
          author.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            author.name
          )}&size=64&background=e0e0e0&color=757575`
        }
        alt={author.name}
        className="w-[32px] h-[32px] rounded-full object-cover flex-shrink-0 mt-0.5 cursor-pointer hover:opacity-80"
      />

      {/* Text block */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[#262626] leading-snug">
          <span className="font-semibold mr-1 cursor-pointer hover:text-gray-500">{displayName}</span>
          {content}
        </p>

        <div className="flex items-center gap-[12px] mt-[6px]">
          <span className="text-[12px] text-[#737373]">
            {timeAgo(createdAt)}
          </span>
          <span className="text-[12px] font-semibold text-[#737373]">
            0 suka
          </span>
          <button
            onClick={() => onReply?.(id, displayName)}
            className="text-[12px] font-semibold text-[#737373] hover:text-[#262626] transition-colors"
          >
            Balas
          </button>
        </div>
      </div>

      {/* Like button */}
      <button
        onClick={() => setLiked(!liked)}
        className="pt-1 flex-shrink-0 active:scale-90 transition-transform"
        aria-label="Suka komentar"
      >
        <Heart
          size={12}
          className={
            liked
              ? "fill-[#ff3040] text-[#ff3040]"
              : "text-[#737373] hover:text-[#262626]"
          }
          fill={liked ? "currentColor" : "none"}
        />
      </button>
    </div>
  )
}
