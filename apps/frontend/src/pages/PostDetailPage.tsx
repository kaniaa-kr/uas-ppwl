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
  Smile
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

type Comment = {
  id: string
  content: string
  created_at: string
  parent_id: string | null
  user: {
    name: string
    username: string
    avatar_url?: string
  }
}

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const [newComment, setNewComment] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyUsername, setReplyUsername] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/posts`)
        const data = await res.json()
        const found = data.find((p: any) => p.id === id)
        if (found) setPost(found)
      } catch (error) {
        toast.error("Gagal load post")
      }
    }

    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/comments/post/${id}`)
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
    setReplyUsername(username)
    inputRef.current?.focus()
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return

    const tempComment: Comment = {
      id: Math.random().toString(),
      content: newComment,
      created_at: new Date().toISOString(),
      parent_id: replyTo,
      user: {
        name: user.name,
        username: user.username,
        avatar_url: user.avatar_url,
      },
    }

    setComments((prev) => [...prev, tempComment])
    setNewComment("")
    setReplyTo(null)
    setReplyUsername(null)

    toast.success("Komentar berhasil ditambahkan (simulasi)")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 rounded-full border-2 border-[#dbdbdb] border-t-[#737373] animate-spin" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="text-center pt-32">Postingan tidak ditemukan</div>
      </div>
    )
  }

  const rootComments = comments.filter((c) => !c.parent_id)
  const replies = comments.filter((c) => c.parent_id)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      {/* Content offset for desktop sidebar */}
      <div className="md:ml-[72px] lg:ml-[244px]">
        {/* Mobile top spacing */}
        <div className="h-[48px] md:hidden" />

        {/* ── Desktop: split card layout ─────────────────────────────── */}
        <div className="hidden md:flex max-w-[935px] mx-auto mt-6 bg-white border border-[#dbdbdb] rounded-r-[3px]" style={{ maxHeight: "calc(100vh - 80px)", minHeight: "450px" }}>
          {/* Left: Image */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={`Post oleh ${post.user.username}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full aspect-square bg-[#fafafa] flex items-center justify-center border-r border-[#dbdbdb]">
                <span className="text-[#737373] text-sm font-semibold">Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Right: Comments panel */}
          <div className="w-[335px] lg:w-[405px] flex flex-col border-l border-[#dbdbdb]" style={{ maxHeight: "calc(100vh - 80px)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-[14px] border-b border-[#efefef] flex-shrink-0">
              <div className="flex items-center gap-[14px]">
                <div className="w-[32px] h-[32px] rounded-full p-[1.5px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976]">
                  <div className="w-full h-full rounded-full bg-white p-[1px]">
                    <img
                      src={
                        post.user.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&size=64&background=e0e0e0&color=757575`
                      }
                      alt={post.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[14px] font-semibold text-[#262626] hover:text-gray-500 cursor-pointer">
                  {post.user.username}
                </span>
              </div>
              <button className="text-[#262626] hover:text-[#737373] transition-colors p-1">
                <MoreHorizontal size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Caption + Comments scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">
              {/* Caption as first "comment" */}
              <div className="flex gap-[14px] mb-4 pb-4">
                <img
                  src={
                    post.user.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&size=64&background=e0e0e0&color=757575`
                  }
                  alt={post.user.name}
                  className="w-[32px] h-[32px] rounded-full object-cover flex-shrink-0 mt-0.5"
                />
                <p className="text-[14px] text-[#262626] leading-snug">
                  <span className="font-semibold mr-1 hover:text-gray-500 cursor-pointer">{post.user.username}</span>
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
                      />
                    ))}
                </div>
              ))}
            </div>

            {/* Action icons + comment input */}
            <div className="border-t border-[#efefef] flex-shrink-0 bg-white">
              {/* Icons */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setLiked(!liked)}
                    aria-label="Suka"
                    className="transition-transform active:scale-90"
                  >
                    <Heart
                      size={26}
                      strokeWidth={1.5}
                      className={liked ? "text-[#ff3040]" : "text-[#262626] hover:text-[#737373]"}
                      fill={liked ? "currentColor" : "none"}
                    />
                  </button>
                  <button aria-label="Komentar" className="text-[#262626] hover:text-[#737373] transition-colors" onClick={() => inputRef.current?.focus()}>
                    <MessageCircle size={26} strokeWidth={1.5} style={{ transform: "scaleX(-1)" }} />
                  </button>
                  <button aria-label="Bagikan" className="text-[#262626] hover:text-[#737373] transition-colors">
                    <Send size={26} strokeWidth={1.5} />
                  </button>
                </div>
                <button aria-label="Simpan" className="text-[#262626] hover:text-[#737373] transition-colors">
                  <Bookmark size={26} strokeWidth={1.5} />
                </button>
              </div>

              {/* Likes count */}
              <p className="px-4 text-[14px] font-semibold text-[#262626] pb-[6px]">
                {(post._count.likes).toLocaleString("id-ID")} suka
              </p>
              
              <p className="px-4 text-[10px] text-[#737373] uppercase mb-3">1 HARI YANG LALU</p>

              {/* Reply indicator */}
              {replyUsername && (
                <div className="px-4 py-2 text-xs text-[#737373] flex items-center justify-between bg-[#fafafa] border-t border-[#efefef]">
                  <div>
                    <span>Membalas </span>
                    <span className="font-semibold text-[#262626]">@{replyUsername}</span>
                  </div>
                  <button
                    onClick={() => { setReplyTo(null); setReplyUsername(null) }}
                    className="text-[#262626] font-semibold text-[10px]"
                  >
                    BATAL
                  </button>
                </div>
              )}

              {/* Comment input */}
              <div className="flex items-center gap-3 px-4 py-3 border-t border-[#efefef]">
                <button className="text-[#262626]"><Smile size={24} strokeWidth={1.5} /></button>
                <input
                  ref={inputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                  placeholder="Tambahkan komentar..."
                  className="flex-1 text-[14px] text-[#262626] placeholder-[#8e8e8e] outline-none bg-transparent h-[24px]"
                />
                {newComment.trim() && (
                  <button
                    onClick={handleSubmitComment}
                    className="text-[#0095f6] font-semibold text-[14px] hover:text-[#00376b] transition-colors"
                  >
                    Kirim
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile: stacked layout ──────────────────────────────────── */}
        <div className="md:hidden bg-white min-h-screen">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-4 h-[44px] border-b border-[#dbdbdb]">
            <div className="flex items-center gap-6">
              <button onClick={() => navigate(-1)} className="text-[#262626]">
                <ArrowLeft size={24} strokeWidth={1.5} />
              </button>
              <span className="text-[16px] font-semibold text-[#262626]">Postingan</span>
            </div>
          </div>

          {/* Post author row */}
          <div className="flex items-center justify-between px-3 py-[10px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976]">
                <div className="w-full h-full rounded-full bg-white p-[1.5px]">
                  <img
                    src={
                      post.user.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&size=64&background=e0e0e0&color=757575`
                    }
                    alt={post.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[14px] font-semibold text-[#262626]">{post.user.username}</span>
            </div>
            <button className="text-[#262626] p-1">
              <MoreHorizontal size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Image */}
          {post.image_url && (
            <div className="w-full aspect-square bg-[#fafafa] overflow-hidden">
              <img
                src={post.image_url}
                alt={`Post oleh ${post.user.username}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between px-3 pt-[6px] pb-[6px]">
            <div className="flex items-center gap-[14px]">
              <button onClick={() => setLiked(!liked)} aria-label="Suka" className="active:scale-90 transition-transform">
                <Heart size={26} strokeWidth={1.5} className={liked ? "text-[#ff3040]" : "text-[#262626]"} fill={liked ? "currentColor" : "none"} />
              </button>
              <button aria-label="Komentar" className="text-[#262626]" onClick={() => inputRef.current?.focus()}>
                <MessageCircle size={26} strokeWidth={1.5} style={{ transform: "scaleX(-1)" }} />
              </button>
              <button aria-label="Bagikan" className="text-[#262626]">
                <Send size={26} strokeWidth={1.5} />
              </button>
            </div>
            <button aria-label="Simpan" className="text-[#262626]">
              <Bookmark size={26} strokeWidth={1.5} />
            </button>
          </div>

          {/* Likes */}
          <p className="px-3 text-[14px] font-semibold text-[#262626] pb-[2px]">
            {(post._count.likes).toLocaleString("id-ID")} suka
          </p>

          {/* Caption */}
          <p className="px-3 pb-2 text-[14px] text-[#262626]">
            <span className="font-semibold mr-1">{post.user.username}</span>
            {post.content}
          </p>

          {/* Comments */}
          <div className="border-t border-[#efefef] px-3 py-3 mb-[100px]">
            {rootComments.map((comment) => (
              <div key={comment.id}>
                <CommentItem
                  id={comment.id}
                  author={comment.user}
                  content={comment.content}
                  createdAt={comment.created_at}
                  parentId={comment.parent_id}
                  onReply={handleReply}
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
                    />
                  ))}
              </div>
            ))}
          </div>

          {/* Fixed Comment Input for Mobile */}
          <div className="fixed bottom-[48px] left-0 right-0 bg-white border-t border-[#dbdbdb] z-40">
            {replyUsername && (
              <div className="px-4 py-2 text-xs text-[#737373] flex items-center justify-between bg-[#fafafa]">
                <div>
                  <span>Membalas </span>
                  <span className="font-semibold text-[#262626]">@{replyUsername}</span>
                </div>
                <button onClick={() => { setReplyTo(null); setReplyUsername(null) }} className="text-[#262626] font-semibold text-[10px]">
                  BATAL
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 px-4 py-3 pb-[env(safe-area-inset-bottom)]">
              <img
                src={
                  user?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&size=64&background=e0e0e0&color=757575`
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
                className="flex-1 text-[14px] text-[#262626] placeholder-[#8e8e8e] outline-none bg-transparent"
              />
              {newComment.trim() && (
                <button
                  onClick={handleSubmitComment}
                  className="text-[#0095f6] font-semibold text-[14px]"
                >
                  Kirim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
