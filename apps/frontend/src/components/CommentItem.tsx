import { Heart } from "lucide-react"
import { useState } from "react"

type CommentItemProps = {
  id: string
  author: {
    id: string
    name: string
    username?: string
    avatar_url?: string
  }
  content: string
  createdAt: string
  parentId?: string | null
  onReply?: (commentId: string, username: string) => void
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Baru saja"
    if (diffMins < 60) return `${diffMins} mnt`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} j`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} h`
    return date.toLocaleDateString("id-ID")
  }

  return (
    <div
      className={`flex items-start gap-3 py-[10px] ${
        parentId ? "ml-11 pl-0" : ""
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
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
      />

      {/* Text block */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#262626] leading-snug">
          <span className="font-semibold mr-1">{displayName}</span>
          {content}
        </p>

        <div className="flex items-center gap-4 mt-[5px]">
          <span className="text-[11px] text-[#737373]">
            {formatDate(createdAt)}
          </span>

          <button
            onClick={() => onReply?.(id, displayName)}
            className="text-[11px] text-[#737373] font-semibold hover:text-[#262626] transition-colors"
          >
            Balas
          </button>
        </div>
      </div>

      {/* Like button */}
      <button
        onClick={() => setLiked(!liked)}
        className="pt-1 flex-shrink-0"
        aria-label="Suka komentar"
      >
        <Heart
          size={11}
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
