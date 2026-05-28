import { Link } from "react-router-dom"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"

type PostCardProps = {
  id: string
  content: string
  image_url?: string | null
  user: {
    name: string
    username: string
    avatar_url?: string | null
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
    <article className="bg-white md:border md:border-[#dbdbdb] md:rounded-[3px] border-b border-[#efefef]">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 md:px-4 py-[10px] md:py-[12px]">
        <Link to={`/profile/${user.username}`} className="flex items-center gap-[10px] min-w-0 group">
          {/* Avatar with gradient ring */}
          <div className="flex-shrink-0 w-8 h-8 md:w-[42px] md:h-[42px] rounded-full p-[2px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976]">
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
            <p className="text-[14px] font-semibold text-[#262626] truncate leading-tight group-hover:text-gray-600 transition-colors">
              {user.username}
            </p>
          </div>
        </Link>
        <button
          className="text-[#262626] hover:text-[#737373] transition-colors p-1 -mr-1"
          aria-label="Opsi lainnya"
        >
          <MoreHorizontal size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Image — edge-to-edge on mobile ────────────────── */}
      {image_url && (
        <div className="w-full aspect-square overflow-hidden bg-[#fafafa]">
          <img
            src={image_url}
            alt={`Post oleh ${user.username}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ── Action icons row ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 md:px-4 pt-[6px] pb-[6px]">
        {/* Left: Like / Comment / Share */}
        <div className="flex items-center gap-[14px]">
          <button
            aria-label="Suka"
            className="text-[#262626] hover:text-[#737373] transition-colors active:scale-90 transition-transform"
          >
            <Heart size={26} strokeWidth={1.5} />
          </button>
          <Link
            to={`/post/${id}`}
            aria-label="Komentar"
            className="text-[#262626] hover:text-[#737373] transition-colors"
          >
            <MessageCircle size={26} strokeWidth={1.5} style={{ transform: "scaleX(-1)" }} />
          </Link>
          <button
            aria-label="Bagikan"
            className="text-[#262626] hover:text-[#737373] transition-colors"
          >
            <Send size={26} strokeWidth={1.5} />
          </button>
        </div>

        {/* Right: Bookmark */}
        <button aria-label="Simpan" className="text-[#262626] hover:text-[#737373] transition-colors">
          <Bookmark size={26} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Likes count ─────────────────────────────────────────────── */}
      <div className="px-3 md:px-4 pt-[2px]">
        <p className="text-[14px] font-semibold text-[#262626] leading-snug">
          {likes.toLocaleString("id-ID")} suka
        </p>
      </div>

      {/* ── Caption with bold username ───────────────────────────────── */}
      <div className="px-3 md:px-4 pt-1 pb-3">
        <p className="text-[14px] text-[#262626] leading-snug break-words">
          <Link to={`/profile/${user.username}`} className="font-semibold mr-1 hover:text-gray-500">{user.username}</Link>
          {content}
        </p>
        {comments > 0 && (
          <Link
            to={`/post/${id}`}
            className="block mt-1 text-[14px] text-[#737373] hover:text-[#262626] transition-colors"
          >
            Lihat semua {comments} komentar
          </Link>
        )}
      </div>
    </article>
  )
}
