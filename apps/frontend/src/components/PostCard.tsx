import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2 } from "lucide-react"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

type PostCardProps = {
  id: string
  content: string
  image_url?: string | null
  user: {
    id: string
    name: string
    username: string
    avatar_url?: string | null
  }
  likes: number
  comments: number
  onDeleted?: (id: string) => void
}

export default function PostCard({
  id,
  content,
  image_url,
  user,
  likes: initialLikes,
  comments,
  onDeleted,
}: PostCardProps) {
  const currentUser = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [likeLoading, setLikeLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isOwner = currentUser?.id === user.id

  const handleLike = async () => {
    if (!token || likeLoading) return
    setLikeLoading(true)
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikesCount((c) => (wasLiked ? c - 1 : c + 1))
    try {
      const res = await fetch(`${API_URL}/posts/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setLiked(data.liked)
    } catch {
      setLiked(wasLiked)
      setLikesCount((c) => (wasLiked ? c + 1 : c - 1))
      toast.error("Gagal update like")
    } finally {
      setLikeLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!token) return
    if (!confirm("Hapus postingan ini?")) return
    setShowMenu(false)
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      toast.success("Postingan dihapus")
      onDeleted?.(id)
    } catch {
      toast.error("Gagal menghapus postingan")
    }
  }

  return (
    <article className="bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 md:border md:rounded-sm w-full max-w-[470px] mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 md:px-4 py-[10px] md:py-[12px]">
        <Link
          to={`/profile/${user.username}`}
          className="flex items-center gap-[10px] min-w-0 group"
        >
          {/* Avatar with gradient ring */}
          <div className="flex-shrink-0 w-8 h-8 md:w-[42px] md:h-[42px] rounded-full p-[2px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976]">
            <div className="w-full h-full rounded-full bg-white dark:bg-black p-[1.5px]">
              <img
                src={
                  user.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=64&background=262626&color=ffffff`
                }
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-neutral-950 dark:text-neutral-50 truncate leading-tight group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors">
              {user.username}
            </p>
          </div>
        </Link>

        <div className="relative">
          <button
            className="text-neutral-950 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors p-1 -mr-1"
            aria-label="Opsi lainnya"
            onClick={() => setShowMenu((v) => !v)}
          >
            <MoreHorizontal size={20} strokeWidth={1.5} />
          </button>

          {showMenu && isOwner && (
            <div className="absolute right-0 top-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-10 min-w-[160px] overflow-hidden">
              <button
                onClick={() => { setShowMenu(false); navigate(`/post/${id}`) }}
                className="w-full text-left px-4 py-3 text-[14px] text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Lihat Detail
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-3 text-[14px] text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors border-t border-neutral-100 dark:border-neutral-800"
              >
                <Trash2 size={14} />
                Hapus Postingan
              </button>
            </div>
          )}

          {showMenu && !isOwner && (
            <div className="absolute right-0 top-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-10 min-w-[160px] overflow-hidden">
              <button
                onClick={() => { setShowMenu(false); navigate(`/post/${id}`) }}
                className="w-full text-left px-4 py-3 text-[14px] text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Lihat Detail
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close menu on outside click */}
      {showMenu && (
        <div className="fixed inset-0 z-[5]" onClick={() => setShowMenu(false)} />
      )}

      {/* ── Image ── */}
      {image_url && (
        <div className="w-full aspect-square overflow-hidden bg-neutral-50 dark:bg-neutral-950 border-y border-neutral-100/50 dark:border-transparent">
          <img
            src={image_url}
            alt={`Post oleh ${user.username}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ── Action icons ── */}
      <div className="flex items-center justify-between px-3 md:px-4 pt-[8px] pb-[6px]">
        <div className="flex items-center gap-[16px]">
          <button
            aria-label="Suka"
            onClick={handleLike}
            disabled={likeLoading}
            className={`transition-transform active:scale-90 ${likeLoading ? "opacity-50" : ""}`}
          >
            <Heart
              size={24}
              strokeWidth={1.5}
              className={liked ? "text-[#ff3040]" : "text-neutral-950 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-400"}
              fill={liked ? "currentColor" : "none"}
              style={{ transition: "fill 0.15s, color 0.15s" }}
            />
          </button>

          <Link
            to={`/post/${id}`}
            aria-label="Komentar"
            className="text-neutral-950 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
          >
            <MessageCircle size={24} strokeWidth={1.5} style={{ transform: "scaleX(-1)" }} />
          </Link>

          <button aria-label="Bagikan" className="text-neutral-950 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors">
            <Send size={24} strokeWidth={1.5} />
          </button>
        </div>

        <button aria-label="Simpan" className="text-neutral-950 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors">
          <Bookmark size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Likes count ── */}
      <div className="px-3 md:px-4 pt-[2px]">
        <p className="text-[14px] font-semibold text-neutral-950 dark:text-neutral-50 leading-snug">
          {likesCount.toLocaleString("id-ID")} suka
        </p>
      </div>

      {/* ── Caption ── */}
      <div className="px-3 md:px-4 pt-1 pb-4">
        <p className="text-[14px] text-neutral-800 dark:text-neutral-200 leading-snug break-words">
          <Link
            to={`/profile/${user.username}`}
            className="font-semibold text-neutral-950 dark:text-neutral-50 mr-1 hover:text-neutral-500 dark:hover:text-neutral-400"
          >
            {user.username}
          </Link>
          {content}
        </p>
        {comments > 0 && (
          <Link
            to={`/post/${id}`}
            className="block mt-1 text-[14px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            Lihat semua {comments} komentar
          </Link>
        )}
      </div>
    </article>
  )
}