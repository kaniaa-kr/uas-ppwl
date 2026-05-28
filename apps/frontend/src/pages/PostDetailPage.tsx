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
  likes_count: number
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
      } catch {
        toast.error("Gagal load post")
      }
    }

    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/comments/post/${id}`)
        const data = await res.json()

        setComments(data)
      } catch {
        toast.error("Gagal load komentar")
      }
    }

    Promise.all([fetchPost(), fetchComments()])
      .finally(() => setLoading(false))
  }, [id])

  const handleReply = (commentId: string, username: string) => {
    setReplyTo(commentId)
    setReplyUsername(username)

    inputRef.current?.focus()
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return

    const token = useAuthStore.getState().token

    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: id,
          content: newComment.trim(),
          parent_id: replyTo,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || "Gagal mengirim komentar")
        return
      }

      const saved: Comment = await res.json()

      setComments((prev) => [...prev, saved])

      setNewComment("")
      setReplyTo(null)
      setReplyUsername(null)

      toast.success("Komentar berhasil ditambahkan")
    } catch {
      toast.error("Gagal mengirim komentar")
    }
  }

  const handleDeleteComment = async (commentId: string) => {
  const token = useAuthStore.getState().token

  try {
    const res = await fetch(`${API_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || "Gagal hapus komentar")
      return
    }

    setComments((prev) =>
      prev.filter(
        (c) =>
          c.id !== commentId &&
          c.parent_id !== commentId
      )
    )

    toast.success("Komentar berhasil dihapus")
  } catch {
    toast.error("Gagal hapus komentar")
  }
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

        <div className="text-center pt-32">
          Postingan tidak ditemukan
        </div>
      </div>
    )
  }

  const renderComments = (
    parentId: string | null = null,
    level = 0
  ): React.ReactNode => {
    return comments
      .filter((c) => c.parent_id === parentId)
      .map((comment) => (
        <div key={comment.id}>
          <div style={{ marginLeft: level * 20 }}>
            <CommentItem
              id={comment.id}
              author={comment.user}
              content={comment.content}
              createdAt={comment.created_at}
              parentId={comment.parent_id}
              likesCount={comment.likes_count}
              onReply={handleReply}
              onDelete={handleDeleteComment}
            />
          </div>

          {renderComments(comment.id, level + 1)}
        </div>
      ))
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <div className="md:ml-[72px] lg:ml-[244px]">
        <div className="h-[48px] md:hidden" />

        {/* DESKTOP */}
        <div
          className="hidden md:flex max-w-[935px] mx-auto mt-6 bg-white border border-[#dbdbdb] rounded-r-[3px]"
          style={{
            maxHeight: "calc(100vh - 80px)",
            minHeight: "450px"
          }}
        >
          {/* LEFT IMAGE */}
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={`Post oleh ${post.user.username}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full aspect-square bg-[#fafafa] flex items-center justify-center border-r border-[#dbdbdb]">
                <span className="text-[#737373] text-sm font-semibold">
                  Tidak ada gambar
                </span>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div
            className="w-[335px] lg:w-[405px] flex flex-col border-l border-[#dbdbdb]"
            style={{
              maxHeight: "calc(100vh - 80px)"
            }}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-[14px] border-b border-[#efefef]">
              <div className="flex items-center gap-[14px]">
                <img
                  src={
                    post.user.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}`
                  }
                  alt={post.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />

                <span className="text-[14px] font-semibold">
                  {post.user.username}
                </span>
              </div>

              <button>
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* COMMENTS */}
            <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">
              {/* CAPTION */}
              <div className="flex gap-3 mb-4">
                <img
                  src={
                    post.user.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}`
                  }
                  alt={post.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />

                <p className="text-sm">
                  <span className="font-semibold mr-1">
                    {post.user.username}
                  </span>

                  {post.content}
                </p>
              </div>

              {/* COMMENTS */}
              {renderComments()}
            </div>

            {/* ACTIONS */}
            <div className="border-t border-[#efefef]">
              <div className="flex items-center justify-between px-4 pt-3">
                <div className="flex items-center gap-4">
                  <button onClick={() => setLiked(!liked)}>
                    <Heart
                      size={26}
                      fill={liked ? "currentColor" : "none"}
                    />
                  </button>

                  <button onClick={() => inputRef.current?.focus()}>
                    <MessageCircle size={26} />
                  </button>

                  <button>
                    <Send size={26} />
                  </button>
                </div>

                <button>
                  <Bookmark size={26} />
                </button>
              </div>

              {/* REPLY INFO */}
              {replyUsername && (
                <div className="px-4 py-2 text-xs bg-[#fafafa] border-t border-[#efefef] flex items-center justify-between">
                  <div>
                    Membalas{" "}
                    <span className="font-semibold">
                      @{replyUsername}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setReplyTo(null)
                      setReplyUsername(null)
                    }}
                  >
                    BATAL
                  </button>
                </div>
              )}

              {/* INPUT */}
              <div className="flex items-center gap-3 px-4 py-3 border-t border-[#efefef]">
                <button>
                  <Smile size={24} />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSubmitComment()
                  }
                  placeholder="Tambahkan komentar..."
                  className="flex-1 outline-none bg-transparent"
                />

                {newComment.trim() && (
                  <button
                    onClick={handleSubmitComment}
                    className="text-[#0095f6] font-semibold"
                  >
                    Kirim
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden bg-white min-h-screen">
          {/* HEADER */}
          <div className="flex items-center gap-4 px-4 h-[44px] border-b">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
            </button>

            <span className="font-semibold">
              Postingan
            </span>
          </div>

          {/* IMAGE */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt=""
              className="w-full aspect-square object-cover"
            />
          )}

          {/* CAPTION */}
          <div className="px-3 py-3">
            <span className="font-semibold mr-1">
              {post.user.username}
            </span>

            {post.content}
          </div>

          {/* COMMENTS */}
          <div className="border-t border-[#efefef] px-3 py-3 mb-[100px]">
            {renderComments()}
          </div>

          {/* INPUT */}
          <div className="fixed bottom-[48px] left-0 right-0 bg-white border-t border-[#dbdbdb]">
            {replyUsername && (
              <div className="px-4 py-2 text-xs flex items-center justify-between">
                <div>
                  Membalas{" "}
                  <span className="font-semibold">
                    @{replyUsername}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setReplyTo(null)
                    setReplyUsername(null)
                  }}
                >
                  BATAL
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 px-4 py-3">
              <input
                ref={inputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmitComment()
                }
                placeholder="Tambahkan komentar..."
                className="flex-1 outline-none bg-transparent"
              />

              {newComment.trim() && (
                <button
                  onClick={handleSubmitComment}
                  className="text-[#0095f6] font-semibold"
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
