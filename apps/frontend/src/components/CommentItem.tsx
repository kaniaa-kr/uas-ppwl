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
      className={`flex gap-3 py-2 ${
        parentId ? "ml-10" : ""
      }`}
    >
      <img
        src={
          author.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            author.name
          )}&size=64&background=random`
        }
        alt={author.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
      />

      <div className="flex-1">
        <p className="text-sm text-[#262626] leading-[18px]">
          <span className="font-semibold">{displayName}</span>{" "}
          {content}
        </p>

        <div className="flex items-center gap-3 mt-[6px]">
          <span className="text-xs text-[#8e8e8e]">
            {formatDate(createdAt)}
          </span>

          <button
            onClick={() => onReply?.(id, displayName)}
            className="text-xs text-[#8e8e8e] font-semibold hover:text-[#262626]"
          >
            Balas
          </button>
        </div>
      </div>

      <button
        onClick={() => setLiked(!liked)}
        className="pt-1"
      >
        <Heart
          size={11}
          className={
            liked
              ? "fill-red-500 text-red-500"
              : "text-[#8e8e8e]"
          }
        />
      </button>
    </div>
  )
}