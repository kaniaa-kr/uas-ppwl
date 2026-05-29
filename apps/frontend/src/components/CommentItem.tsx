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
            className="text-[#00376b] dark:text-[#e0f1ff] font-normal cursor-pointer hover:underline"
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
      <div className={`flex items-start gap-3 py-2 px-4 w-full select-none ${parentId ? "pl-[54px]" : ""}`}>
        
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          <img
            src={
              author?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || "Deleted User")}&size=64&background=e0e0e0&color=757575`
            }
            alt={author?.name || "Deleted User"}
            onClick={goToProfile}
            className={`w-8 h-8 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10 ${
              author?.username ? "cursor-pointer hover:opacity-90 active:opacity-80" : ""
            }`}
          />
        </div>

        {/* Blok teks isi komentar & metadata */}
        <div className="flex-1 min-w-0 text-[14px] leading-tight">
          <div className="inline break-words text-neutral-900 dark:text-neutral-100">
            <span
              onClick={goToProfile}
              className={`font-semibold text-neutral-950 dark:text-neutral-50 mr-2 inline-block ${
                author?.username ? "cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-400" : ""
              }`}
            >
              {displayName}
            </span>
            {renderCommentContent(content)}
          </div>

          {/* Baris interaksi (Waktu, Suka, Balas, Hapus) */}
          <div className="flex items-center gap-3 mt-2 text-[12px] font-medium text-neutral-500 dark:text-neutral-400 tracking-wide">
            <span>{timeAgo(createdAt)}</span>
            
            {likeCount > 0 && (
              <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                {likeCount} suka
              </span>
            )}
            
            {/* ✅ FIX 2: Hapus !parentId — tombol Balas muncul di semua comment */}
            {author?.username && (
              <button
                onClick={handleReply}
                className="hover:text-neutral-800 dark:hover:text-neutral-200 font-semibold transition-colors"
              >
                Balas
              </button>
            )}
            
            {isOwner && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="hover:text-[#ed4956] dark:hover:text-[#ed4956] font-semibold transition-colors"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Tombol suka (Icon Heart kanan) */}
        <button
          onClick={() => {
            setLiked((v) => !v)
            setLikeCount((c) => (liked ? c - 1 : c + 1))
          }}
          className="pt-1.5 flex-shrink-0 active:scale-90 transition-transform text-neutral-400 dark:text-neutral-500"
        >
          <Heart
            size={13}
            className={liked ? "fill-[#ff3040] text-[#ff3040]" : "hover:text-neutral-600 dark:hover:text-neutral-300"}
            fill={liked ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Modal Dialog Konfirmasi Hapus */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
          <div className="bg-white dark:bg-[#262626] rounded-xl w-[260px] overflow-hidden shadow-2xl border border-neutral-200/10 scale-up">
            
            <div className="px-6 py-6 border-b border-neutral-200 dark:border-neutral-800 text-center">
              <p className="text-[16px] font-semibold text-neutral-950 dark:text-neutral-50">Hapus komentar?</p>
              <p className="text-[14px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-snug">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            
            <button
              onClick={() => {
                onDelete?.(id)
                setShowDeleteConfirm(false)
              }}
              className="w-full py-3.5 text-[14px] font-bold text-[#ed4956] active:bg-neutral-100 dark:active:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 transition-colors"
            >
              Hapus
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full py-3.5 text-[14px] font-normal text-neutral-900 dark:text-neutral-100 active:bg-neutral-100 dark:active:bg-neutral-800 transition-colors"
            >
              Batal
            </button>
            
          </div>
        </div>
      )}
    </>
  )
}