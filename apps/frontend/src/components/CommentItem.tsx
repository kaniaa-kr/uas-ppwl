import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart } from "lucide-react"
import { useAuthStore } from "../stores/auth.store"

type CommentItemProps = {
  id: string
  author?: {
    id?: string
    name: string
    username: string
    avatar_url?: string | null
  } | null
  content: string
  createdAt: string
  parentId?: string | null
  onReply?: (commentId: string, username: string) => void
  onDelete?: (commentId: string) => void
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return `baru saja`
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
  onDelete,
}: CommentItemProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const isOwner = !!(currentUser?.id && author?.id && currentUser.id === author.id)
  const displayName = author?.username || author?.name || "Pengguna Dihapus"

  const goToProfile = () => {
    if (author?.username) navigate(`/profile/${author.username}`)
  }

  const renderCommentContent = (text: string) => {
    const parts = text.split(/([@]\S+)/g)
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const targetUsername = part.substring(1)
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/profile/${targetUsername}`)
            }}
            className="text-[#00376b] dark:text-[#0095f6] font-medium cursor-pointer hover:underline"
          >
            {part}
          </span>
        )
      }
      return part
    })
  }

  // ✅ FIX 1: Kalau ini reply, onReply tetap dipanggil tapi dengan parentId asli
  // supaya semua reply masuk ke level yang sama (flat thread, bukan nested tak terbatas)
  const handleReply = () => {
    if (!author?.username) return
    // Kalau ini sudah reply (punya parentId), balas ke parent yang sama
    // supaya tidak nested makin dalam — semua reply satu level
    const replyTargetId = parentId ?? id
    onReply?.(replyTargetId, author.username)
  }

  return (
    <>
      <div className={`flex items-start gap-[14px] py-[8px] ${parentId ? "ml-[46px]" : ""}`}>
        {/* Avatar */}
        <img
          src={
            author?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || "Deleted User")}&size=64&background=e0e0e0&color=757575`
          }
          alt={author?.name || "Deleted User"}
          onClick={goToProfile}
          className={`w-[32px] h-[32px] rounded-full object-cover flex-shrink-0 mt-0.5 ${
            author?.username ? "cursor-pointer hover:opacity-80" : ""
          }`}
        />

        {/* Text block */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-[#262626] leading-snug">
            <span
              onClick={goToProfile}
              className={`font-semibold mr-1 ${author?.username ? "cursor-pointer hover:text-gray-500" : ""}`}
            >
              {displayName}
            </span>
            {renderCommentContent(content)}
          </p>
          <div className="flex items-center gap-[12px] mt-[6px]">
            <span className="text-[12px] text-[#737373]">{timeAgo(createdAt)}</span>
            {likeCount > 0 && (
              <span className="text-[12px] font-semibold text-[#737373]">{likeCount} suka</span>
            )}
            {/* ✅ FIX 2: Hapus !parentId — tombol Balas muncul di semua comment */}
            {author?.username && (
              <button
                onClick={handleReply}
                className="text-[12px] font-semibold text-[#737373] hover:text-[#262626] transition-colors"
              >
                Balas
              </button>
            )}
            {isOwner && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-[12px] font-semibold text-[#737373] hover:text-[#ed4956] transition-colors"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Like button */}
        <button
          onClick={() => {
            setLiked((v) => !v)
            setLikeCount((c) => (liked ? c - 1 : c + 1))
          }}
          className="pt-1 flex-shrink-0 active:scale-90 transition-transform"
        >
          <Heart
            size={12}
            className={liked ? "fill-[#ff3040] text-[#ff3040]" : "text-[#737373] hover:text-[#262626]"}
            fill={liked ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Konfirmasi hapus */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-[260px] overflow-hidden shadow-xl">
            <div className="px-4 py-4 border-b border-[#dbdbdb] text-center">
              <p className="text-[14px] font-semibold text-[#262626]">Hapus komentar?</p>
              <p className="text-[12px] text-[#737373] mt-1">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <button
              onClick={() => {
                onDelete?.(id)
                setShowDeleteConfirm(false)
              }}
              className="w-full py-3 text-[14px] font-semibold text-[#ed4956] border-b border-[#dbdbdb] hover:bg-[#fafafa]"
            >
              Hapus
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full py-3 text-[14px] text-[#262626] hover:bg-[#fafafa]"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  )
}