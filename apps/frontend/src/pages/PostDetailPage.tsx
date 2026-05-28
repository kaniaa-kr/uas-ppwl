import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react"
import Navbar from "../components/Navbar"
import CommentItem from "../components/CommentItem"
import { toast } from "sonner"
import { useAuthStore } from "../stores/auth.store"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

type Post = {
  id: string
  content: string
  image_url?: string
  created_at: string
  user: {
    id: string
    name: string
    username: string
    avatar_url?: string
  }
  _count: {
    likes: number
  }
}

type Comment = {
  id: string
  content: string
  created_at: string
  parent_id?: string | null
  user: {
    id: string
    name: string
    username?: string
    avatar_url?: string
  }
}

const API_URL = import.meta.env.VITE_API_URL

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyUsername, setReplyUsername] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`${API_URL}/posts/${id}`),
          fetch(`${API_URL}/comments/post/${id}`),
        ])

        const postData = await postRes.json()
        const commentsData = await commentsRes.json()

        setPost(postData)
        setComments(commentsData || [])
      } catch {
        toast.error("Gagal memuat data")
      }
    }

    fetchData()
  }, [id])

  const handleReply = (commentId: string, username: string) => {
    setReplyTo(commentId)
    setReplyUsername(username)
    inputRef.current?.focus()
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    try {
      const token = useAuthStore.getState().token

      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          post_id: id,
          content: newComment,
          parent_id: replyTo,
        }),
      })

      const saved = await res.json()
      setComments((prev) => [...prev, saved])

      setNewComment("")
      setReplyTo(null)
      setReplyUsername(null)
    } catch {
      toast.error("Gagal kirim komentar")
    }
  }

  if (!post) return null

  const rootComments = comments.filter((c) => !c.parent_id)
  const replies = comments.filter((c) => c.parent_id)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      {/* Content offset for desktop sidebar */}
      <div className="lg:ml-[244px] xl:ml-[335px]">
        {/* Mobile top spacing */}
        <div className="h-[54px] lg:hidden" />

        {/* ── Desktop: split card layout ─────────────────────────────── */}
        <div className="hidden lg:flex max-w-[935px] mx-auto mt-6 border border-[#dbdbdb] bg-white" style={{ maxHeight: "90vh" }}>
          {/* Left: Image */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={`Post oleh ${post.user.username}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full aspect-square bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-[#737373] text-sm">Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Right: Comments panel */}
          <div className="w-[340px] xl:w-[405px] flex flex-col border-l border-[#dbdbdb]" style={{ maxHeight: "90vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#dbdbdb] flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="text-[#262626] hover:text-[#737373] transition-colors"
                >
                  <ArrowLeft size={20} strokeWidth={1.5} />
                </button>
                <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
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
                <span className="text-sm font-semibold text-[#262626]">
                  {post.user.username}
                </span>
              </div>
              <button className="text-[#262626] hover:text-[#737373] transition-colors">
                <MoreHorizontal size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Caption + Comments scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Caption as first "comment" */}
              <div className="flex gap-3 mb-4 pb-4 border-b border-[#efefef]">
                <img
                  src={
                    post.user.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&size=64&background=e0e0e0&color=757575`
                  }
                  alt={post.user.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-[#262626] leading-snug">
                  <span className="font-semibold mr-1">{post.user.username}</span>
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
            <div className="border-t border-[#dbdbdb] flex-shrink-0">
              {/* Icons */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setLiked(!liked)}
                    aria-label="Suka"
                    className="transition-transform active:scale-90"
                  >
                    <Heart
                      size={24}
                      strokeWidth={1.5}
                      className={liked ? "text-[#ff3040]" : "text-[#262626] hover:text-[#737373]"}
                      fill={liked ? "currentColor" : "none"}
                    />
                  </button>
                  <button aria-label="Komentar" className="text-[#262626] hover:text-[#737373] transition-colors">
                    <MessageCircle size={24} strokeWidth={1.5} />
                  </button>
                  <button aria-label="Bagikan" className="text-[#262626] hover:text-[#737373] transition-colors">
                    <Send size={24} strokeWidth={1.5} />
                  </button>
                </div>
                <button aria-label="Simpan" className="text-[#262626] hover:text-[#737373] transition-colors">
                  <Bookmark size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Likes count */}
              <p className="px-4 text-sm font-semibold text-[#262626] pb-1">
                {(post._count.likes).toLocaleString("id-ID")} suka
              </p>

              {/* Reply indicator */}
              {replyUsername && (
                <div className="px-4 pb-1 text-xs text-[#737373] flex items-center gap-1">
                  <span>Membalas</span>
                  <span className="font-semibold text-[#262626]">@{replyUsername}</span>
                  <button
                    onClick={() => { setReplyTo(null); setReplyUsername(null) }}
                    className="ml-1 text-[#ed4956] font-semibold hover:underline"
                  >
                    Batal
                  </button>
                </div>
              )}

              {/* Comment input */}
              <div className="flex items-center gap-3 px-4 py-3 border-t border-[#efefef]">
                <input
                  ref={inputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                  placeholder="Tambahkan komentar..."
                  className="flex-1 text-sm text-[#262626] placeholder-[#737373] outline-none bg-transparent"
                />
                {newComment.trim() && (
                  <button
                    onClick={handleSubmitComment}
                    className="text-[#0095f6] font-semibold text-sm hover:text-[#00376b] transition-colors"
                  >
                    Kirim
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile: stacked layout ──────────────────────────────────── */}
        <div className="lg:hidden bg-white">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#dbdbdb]">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="text-[#262626]">
                <ArrowLeft size={20} strokeWidth={1.5} />
              </button>
              <span className="text-base font-semibold text-[#262626]">Postingan</span>
            </div>
            <button className="text-[#262626]">
              <MoreHorizontal size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Post author row */}
          <div className="flex items-center justify-between px-3 py-[10px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
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
              <span className="text-sm font-semibold text-[#262626]">{post.user.username}</span>
            </div>
          </div>

          {/* Image */}
          {post.image_url && (
            <div className="w-full aspect-square bg-black overflow-hidden">
              <img
                src={post.image_url}
                alt={`Post oleh ${post.user.username}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between px-3 pt-[10px] pb-[6px]">
            <div className="flex items-center gap-4">
              <button onClick={() => setLiked(!liked)} aria-label="Suka" className="active:scale-90 transition-transform">
                <Heart size={24} strokeWidth={1.5} className={liked ? "text-[#ff3040]" : "text-[#262626]"} fill={liked ? "currentColor" : "none"} />
              </button>
              <button aria-label="Komentar" className="text-[#262626]">
                <MessageCircle size={24} strokeWidth={1.5} />
              </button>
              <button aria-label="Bagikan" className="text-[#262626]">
                <Send size={24} strokeWidth={1.5} />
              </button>
            </div>
            <button aria-label="Simpan" className="text-[#262626]">
              <Bookmark size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Likes */}
          <p className="px-3 text-sm font-semibold text-[#262626] pb-1">
            {(post._count.likes).toLocaleString("id-ID")} suka
          </p>

          {/* Caption */}
          <p className="px-3 pb-2 text-sm text-[#262626]">
            <span className="font-semibold mr-1">{post.user.username}</span>
            {post.content}
          </p>

          {/* Comments */}
          <div className="border-t border-[#efefef] px-3 py-3">
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

          {/* Comment input */}
          {replyUsername && (
            <div className="px-3 py-1 text-xs text-[#737373] flex items-center gap-1 bg-[#fafafa] border-t border-[#efefef]">
              <span>Membalas</span>
              <span className="font-semibold text-[#262626]">@{replyUsername}</span>
              <button onClick={() => { setReplyTo(null); setReplyUsername(null) }} className="ml-1 text-[#ed4956] font-semibold">
                Batal
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 px-3 py-3 border-t border-[#dbdbdb]">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              placeholder="Tambahkan komentar..."
              className="flex-1 text-sm text-[#262626] placeholder-[#737373] outline-none bg-transparent"
            />
            {newComment.trim() && (
              <button
                onClick={handleSubmitComment}
                className="text-[#0095f6] font-semibold text-sm"
              >
                Kirim
              </button>
            )}
          </div>

          {/* bottom nav spacing */}
          <div className="h-[49px]" />
        </div>
      </div>
    </div>
  )
}
