import { Link } from "react-router-dom"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"

type PostCardProps = {
  id: string
  content: string
  image_url?: string
  user: {
    name: string
    username: string
    avatar_url?: string
  }
  likes: number
  comments: number
}

export default function PostCard({
  id,
  content,
  image_url,
  user,
  likes,
  comments,
}: PostCardProps) {
  return (
    <article className="bg-white border-b border-[#dbdbdb] lg:border lg:border-[#dbdbdb] lg:mb-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-[10px]">
        <div className="flex items-center gap-[11px] min-w-0">
          {/* Avatar with gradient ring */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
            <div className="w-full h-full rounded-full bg-white p-[1.5px]">
              <img
                src={
                  user.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=64&background=e0e0e0&color=757575`
                }
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#262626] truncate leading-snug">
              {user.username}
            </p>
          </div>
        </div>
        <button
          className="text-[#262626] hover:text-[#737373] transition-colors p-1 -mr-1"
          aria-label="Opsi lainnya"
        >
          <MoreHorizontal size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Image — edge-to-edge, no rounded corners ────────────────── */}
      {image_url && (
        <div className="w-full aspect-square overflow-hidden bg-[#000]">
          <img
            src={image_url}
            alt={`Post oleh ${user.username}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ── Action icons row ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 pt-[10px] pb-[6px]">
        {/* Left: Like / Comment / Share — no counts */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Suka"
            className="text-[#262626] hover:text-[#737373] transition-colors active:scale-90 transition-transform"
          >
            <Heart size={24} strokeWidth={1.5} />
          </button>
          <Link
            to={`/post/${id}`}
            aria-label="Komentar"
            className="text-[#262626] hover:text-[#737373] transition-colors"
          >
            <MessageCircle size={24} strokeWidth={1.5} />
          </Link>
          <button
            aria-label="Bagikan"
            className="text-[#262626] hover:text-[#737373] transition-colors"
          >
            <Send size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Right: Bookmark */}
        <button aria-label="Simpan" className="text-[#262626] hover:text-[#737373] transition-colors">
          <Bookmark size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Likes count ─────────────────────────────────────────────── */}
      <div className="px-3 pt-[2px]">
        <p className="text-sm font-semibold text-[#262626] leading-snug">
          {likes.toLocaleString("id-ID")} suka
        </p>
      </div>

      {/* ── Caption with bold username ───────────────────────────────── */}
      <div className="px-3 pt-1 pb-3">
        <p className="text-sm text-[#262626] leading-snug">
          <span className="font-semibold mr-1">{user.username}</span>
          {content}
        </p>
        {comments > 0 && (
          <Link
            to={`/post/${id}`}
            className="block mt-1 text-sm text-[#737373] hover:text-[#262626] transition-colors"
          >
            Lihat semua {comments} komentar
          </Link>
        )}
      </div>
    </article>
  )
}
