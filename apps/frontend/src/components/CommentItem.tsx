import { useState } from "react"
import { Heart, MoreHorizontal } from "lucide-react"
import { useAuthStore } from "../stores/auth.store"

const API_URL = import.meta.env.VITE_API_URL

type CommentItemProps = {
  id: string
  author: {
    id?: string
    name: string
    username: string
    avatar_url?: string
  }
  content: string
  createdAt: string
  parentId?: string | null

  likesCount?: number
  isLiked?: boolean

  onReply?: (commentId: string, username: string) => void
  onDelete?: (commentId: string) => void
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
  likesCount = 0,
  isLiked = false,
  onReply,
  onDelete,
}: CommentItemProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likes, setLikes] = useState(likesCount)
  const [isLiking, setIsLiking] = useState(false)

  const [showMenu, setShowMenu] = useState(false)

  const token = useAuthStore((s) => s.token)
  const currentUser = useAuthStore((s) => s.user)

  const displayName = author.username || author.name

  const isOwner =
    currentUser?.username === author.username

  const handleLike = async () => {
    if (!token || isLiking) return

    setIsLiking(true)

    const wasLiked = liked

    setLiked(!liked)

    setLikes((prev) =>
      wasLiked ? prev - 1 : prev + 1
    )

    try {
      const res = await fetch(
        `${API_URL}/comments/${id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        setLiked(wasLiked)

        setLikes((prev) =>
          wasLiked ? prev + 1 : prev - 1
        )
      } else {
        const data = await res.json()

        setLiked(data.liked)
        setLikes(data.likes_count)
      }
    } catch {
      setLiked(wasLiked)

      setLikes((prev) =>
        wasLiked ? prev + 1 : prev - 1
      )
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <>
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

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-[#262626] leading-snug">
            <span className="font-semibold mr-1 cursor-pointer hover:text-gray-500">
              {displayName}
            </span>

            {content}
          </p>

          <div className="flex items-center gap-[12px] mt-[6px]">
            <span className="text-[12px] text-[#737373]">
              {timeAgo(createdAt)}
            </span>

            {likes > 0 && (
              <span className="text-[12px] font-semibold text-[#737373]">
                {likes} suka
              </span>
            )}

            <button
              onClick={() =>
                onReply?.(id, displayName)
              }
              className="text-[12px] font-semibold text-[#737373] hover:text-[#262626] transition-colors"
            >
              Balas
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* titik 3 */}
          {isOwner && (
            <button
              onClick={() => setShowMenu(true)}
              className="text-[#737373] hover:text-black"
            >
              <MoreHorizontal size={14} />
            </button>
          )}

          {/* Like */}
          <button
            onClick={handleLike}
            disabled={isLiking}
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
      </div>

      {/* Modal */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-32">
          <div className="bg-white w-[95%] max-w-md rounded-2xl overflow-hidden shadow-xl">
            <button
              onClick={() => {
                onDelete?.(id)
                setShowMenu(false)
              }}
              className="w-full py-4 text-red-500 font-semibold border-b border-[#efefef]"
            >
              Hapus
            </button>

            <button
              onClick={() => setShowMenu(false)}
              className="w-full py-4 text-[#262626]"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  )
}