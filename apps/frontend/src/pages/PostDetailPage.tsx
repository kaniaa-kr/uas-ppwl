import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import Navbar from "../components/Navbar"
import CommentItem from "../components/CommentItem"
import { toast } from "sonner"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ArrowLeft,
  Smile,
  Trash2,
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

type Comment = {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  parent_id: string | null
  user: {
    id: string
    name: string
    username: string
    avatar_url: string | null
  } | null
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return "Baru saja"
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari yang lalu`
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyUsername, setReplyUsername] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [likeLoading, setLikeLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/posts/${id}`)
        if (!res.ok) throw new Error("Post tidak ditemukan")
        const data = await res.json()
        setPost(data)
        setLikesCount(data._count?.likes ?? 0)
      } catch (error) {
        toast.error("Gagal load post")
      }
    }
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/comments/post/${id}`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setComments(data)
      } catch (error) {
        toast.error("Gagal load komentar")
      }
    }
    Promise.all([fetchPost(), fetchComments()]).finally(() => setLoading(false))
  }, [id])

  const handleReply = (commentId: string, username: string) => {
    setReplyTo(commentId)
    setNewComment(`@${username} `)
    setReplyUsername(username)
    inputRef.current?.focus()
  }

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

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user || !token || !id || submitting) return
    setSubmitting(true)
    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      content: newComment,
      created_at: new Date().toISOString(),
      parent_id: replyTo,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar_url: user.avatar_url ?? null,
      },
      post_id: id || "",
      user_id: user.id,
    }
    setComments((prev) => [...prev, tempComment])
    const commentText = newComment
    setNewComment("")
    setReplyTo(null)
    setReplyUsername(null)
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: id,
          content: commentText,
          ...(replyTo ? { parent_id: replyTo } : {}),
        }),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      setComments((prev) =>
        prev.map((c) =>
          c.id === tempComment.id ? { ...saved, parent_id: saved.parent_id ?? null } : c
        )
      )
    } catch {
      setComments((prev) => prev.filter((c) => c.id !== tempComment.id))
      setNewComment(commentText)
      toast.error("Gagal mengirim komentar")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async () => {
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
      navigate("/")
    } catch {
      toast.error("Gagal menghapus postingan")
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return
    try {
      await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      toast.success("Komentar dihapus")
    } catch {
      toast.error("Gagal menghapus komentar")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 rounded-full border-2 border-[#363636] border-t-[#737373] animate-spin" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="text-center pt-32 text-[#737373]">Postingan tidak ditemukan</div>
      </div>
    )
  }

  const isOwner = user?.id === post.user.id
  const rootComments = comments.filter((c) => !c.parent_id)
  const replies = comments.filter((c) => c.parent_id)

  // ── Shared: Action bar & comment input ──
  const ActionBar = (
    <div className="border-t border-[#262626] flex-shrink-0 bg-black">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            aria-label="Suka"
            className={`transition-transform active:scale-90 ${likeLoading ? "opacity-50" : ""}`}
          >
            <Heart
              size={26}
              strokeWidth={1.5}
              className={liked ? "text-[#ff3040]" : "text-white hover:text-[#737373]"}
              fill={liked ? "currentColor" : "none"}
              style={{ transition: "fill 0.15s, color 0.15s" }}
            />
          </button>
          <button
            aria-label="Komentar"
            className="text-white hover:text-[#737373] transition-colors"
            onClick={() => inputRef.current?.focus()}
          >
            <MessageCircle size={26} strokeWidth={1.5} style={{ transform: "scaleX(-1)" }} />
          </button>
          <button aria-label="Bagikan" className="text-white hover:text-[#737373] transition-colors">
            <Send size={26} strokeWidth={1.5} />
          </button>
        </div>
        <button aria-label="Simpan" className="text-white hover:text-[#737373] transition-colors">
          <Bookmark size={26} strokeWidth={1.5} />
        </button>
      </div>

      <p className="px-4 text-[14px] font-semibold text-white pb-[6px]">
        {likesCount.toLocaleString("id-ID")} suka
      </p>
      <p className="px-4 text-[11px] text-[#737373] uppercase mb-3 tracking-wider">
        {timeAgo(post.created_at)}
      </p>

      {replyUsername && (
        <div className="px-4 py-2 text-xs text-[#737373] flex items-center justify-between bg-[#0d0d0d] border-t border-[#262626]">
          <div>
            <span>Membalas </span>
            <span className="font-semibold text-white">@{replyUsername}</span>
          </div>
          <button
            onClick={() => { setReplyTo(null); setReplyUsername(null) }}
            className="text-white font-semibold text-[10px]"
          >
            BATAL
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 px-4 py-3 border-t border-[#262626]">
        <button className="text-[#737373]">
          <Smile size={24} strokeWidth={1.5} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
          placeholder="Tambahkan komentar..."
          disabled={submitting}
          className="flex-1 text-[14px] text-white placeholder-[#6b6b6b] outline-none bg-transparent h-[24px] disabled:opacity-50"
        />
        {newComment.trim() && (
          <button
            onClick={handleSubmitComment}
            disabled={submitting}
            className="text-[#0095f6] font-semibold text-[14px] hover:text-white transition-colors disabled:opacity-50"
          >
            {submitting ? "..." : "Kirim"}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="md:ml-[72px] lg:ml-[244px]">
        <div className="h-[48px] md:hidden" />

        {/* ── Desktop: split card layout ── */}
        <div
          className="hidden md:flex max-w-[935px] mx-auto mt-6 bg-black border border-[#262626] rounded-r-sm"
          style={{ maxHeight: "calc(100vh - 80px)", minHeight: "450px" }}
        >
          {/* Left: Image */}
          <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={`Post oleh ${post.user.username}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-[#0d0d0d] flex items-center justify-center border-r border-[#262626]">
                <div className="text-center px-8">
                  <p className="text-white font-semibold text-lg mb-1">{post.user.username}</p>
                  <p className="text-[#737373] text-sm leading-snug break-words">{post.content}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Comments panel */}
          <div
            className="w-[335px] lg:w-[405px] flex flex-col border-l border-[#262626]"
            style={{ maxHeight: "calc(100vh - 80px)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-[14px] border-b border-[#262626] flex-shrink-0">
              <div className="flex items-center gap-[14px]">
                <div className="w-[32px] h-[32px] rounded-full p-[1.5px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976]">
                  <div className="w-full h-full rounded-full bg-black p-[1px]">
                    <img
                      src={
                        post.user.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&size=64&background=262626&color=ffffff`
                      }
                      alt={post.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[14px] font-semibold text-white hover:text-[#a0a0a0] cursor-pointer">
                  {post.user.username}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowMenu((v) => !v)}
                  className="text-white hover:text-[#737373] transition-colors p-1"
                >
                  <MoreHorizontal size={20} strokeWidth={1.5} />
                </button>
                {showMenu && isOwner && (
                  <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-[#363636] rounded-xl shadow-xl z-10 min-w-[160px] overflow-hidden">
                    <button
                      onClick={handleDeletePost}
                      className="w-full text-left px-4 py-3 text-[14px] text-[#ff3040] flex items-center gap-2 hover:bg-[#262626] transition-colors"
                    >
                      <Trash2 size={14} />
                      Hapus Postingan
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Caption + Comments scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
              {/* Caption */}
              <div className="flex gap-[14px] mb-4 pb-4">
                <img
                  src={
                    post.user.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&size=64&background=262626&color=ffffff`
                  }
                  alt={post.user.name}
                  className="w-[32px] h-[32px] rounded-full object-cover flex-shrink-0 mt-0.5"
                />
                <p className="text-[14px] text-[#f5f5f5] leading-snug">
                  <span className="font-semibold text-white mr-1 hover:text-[#a0a0a0] cursor-pointer">
                    {post.user.username}
                  </span>
                  {post.content}
                </p>
              </div>

              {/* Comments */}
              {rootComments.map((comment) => (
                <div key={comment.id}>
                  <CommentItem
                    id={comment.id}
                    author={comment.user}
                    content={comment.content}
                    createdAt={comment.created_at}
                    parentId={comment.parent_id}
                    onReply={handleReply}
                    onDelete={handleDeleteComment}
                  />
                  {replies
                    .filter((r) => r.parent_id === comment.id)
                    .map((reply) => (
                      <CommentItem
                        key={reply.id}
                        id={reply.id}
                        author={reply.user}
                        content={reply.content}
                        createdAt={reply.created_at}
                        parentId={reply.parent_id}
                        onReply={handleReply}
                        onDelete={handleDeleteComment}
                      />
                    ))}
                </div>
              ))}
            </div>

            {ActionBar}
          </div>
        </div>

        {/* ── Mobile: stacked layout ── */}
        <div className="md:hidden bg-black min-h-screen">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-4 h-[44px] border-b border-[#262626]">
            <div className="flex items-center gap-6">
              <button onClick={() => navigate(-1)} className="text-white">
                <ArrowLeft size={24} strokeWidth={1.5} />
              </button>
              <span className="text-[16px] font-semibold text-white">Postingan</span>
            </div>
            {isOwner && (
              <button onClick={handleDeletePost} className="text-[#ff3040] p-1">
                <Trash2 size={20} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Post author row */}
          <div className="flex items-center justify-between px-3 py-[10px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976]">
                <div className="w-full h-full rounded-full bg-black p-[1.5px]">
                  <img
                    src={
                      post.user.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&size=64&background=262626&color=ffffff`
                    }
                    alt={post.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[14px] font-semibold text-white">
                {post.user.username}
              </span>
            </div>
          </div>

          {/* Image */}
          {post.image_url && (
            <div className="w-full aspect-square bg-[#0a0a0a] overflow-hidden">
              <img
                src={post.image_url}
                alt={`Post oleh ${post.user.username}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between px-3 pt-[8px] pb-[6px]">
            <div className="flex items-center gap-[14px]">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                aria-label="Suka"
                className={`active:scale-90 transition-transform ${likeLoading ? "opacity-50" : ""}`}
              >
                <Heart
                  size={26}
                  strokeWidth={1.5}
                  className={liked ? "text-[#ff3040]" : "text-white"}
                  fill={liked ? "currentColor" : "none"}
                />
              </button>
              <button
                aria-label="Komentar"
                className="text-white"
                onClick={() => inputRef.current?.focus()}
              >
                <MessageCircle size={26} strokeWidth={1.5} style={{ transform: "scaleX(-1)" }} />
              </button>
              <button aria-label="Bagikan" className="text-white">
                <Send size={26} strokeWidth={1.5} />
              </button>
            </div>
            <button aria-label="Simpan" className="text-white">
              <Bookmark size={26} strokeWidth={1.5} />
            </button>
          </div>

          <p className="px-3 text-[14px] font-semibold text-white pb-[2px]">
            {likesCount.toLocaleString("id-ID")} suka
          </p>
          <p className="px-3 text-[11px] text-[#737373] uppercase mb-2 tracking-wider">
            {timeAgo(post.created_at)}
          </p>

          <p className="px-3 pb-2 text-[14px] text-[#f5f5f5]">
            <span className="font-semibold text-white mr-1">{post.user.username}</span>
            {post.content}
          </p>

          {/* Comments */}
          <div className="border-t border-[#262626] px-3 py-3 mb-[110px]">
            {rootComments.map((comment) => (
              <div key={comment.id}>
                <CommentItem
                  id={comment.id}
                  author={comment.user}
                  content={comment.content}
                  createdAt={comment.created_at}
                  parentId={comment.parent_id}
                  onReply={handleReply}
                  onDelete={handleDeleteComment}
                />
                {replies
                  .filter((r) => r.parent_id === comment.id)
                  .map((reply) => (
                    <CommentItem
                      key={reply.id}
                      id={reply.id}
                      author={reply.user}
                      content={reply.content}
                      createdAt={reply.created_at}
                      parentId={reply.parent_id}
                      onReply={handleReply}
                      onDelete={handleDeleteComment}
                    />
                  ))}
              </div>
            ))}
          </div>

          {/* Fixed Comment Input for Mobile */}
          <div className="fixed bottom-[48px] left-0 right-0 bg-black border-t border-[#262626] z-40">
            {replyUsername && (
              <div className="px-4 py-2 text-xs text-[#737373] flex items-center justify-between bg-[#0d0d0d]">
                <div>
                  <span>Membalas </span>
                  <span className="font-semibold text-white">@{replyUsername}</span>
                </div>
                <button
                  onClick={() => { setReplyTo(null); setReplyUsername(null) }}
                  className="text-white font-semibold text-[10px]"
                >
                  BATAL
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 px-4 py-3 pb-[env(safe-area-inset-bottom)]">
              <img
                src={
                  user?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&size=64&background=262626&color=ffffff`
                }
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <input
                ref={inputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                placeholder="Tambahkan komentar..."
                disabled={submitting}
                className="flex-1 text-[14px] text-white placeholder-[#6b6b6b] outline-none bg-transparent disabled:opacity-50"
              />
              {newComment.trim() && (
                <button
                  onClick={handleSubmitComment}
                  disabled={submitting}
                  className="text-[#0095f6] font-semibold text-[14px] disabled:opacity-50"
                >
                  {submitting ? "..." : "Kirim"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
