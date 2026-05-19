import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Heart,
  MessageCircle,
  Share2,
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
  const user = useAuthStore((s) => s.user)
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
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10 border border-[#dbdbdb] bg-white flex">

        {/* IMAGE */}
        <div className="w-1/2 bg-black flex items-center justify-center">
          {post.image_url && (
            <img
              src={post.image_url}
              className="w-full object-contain"
            />
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col h-[80vh]">

          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <ArrowLeft
                size={20}
                onClick={() => navigate(-1)}
                className="cursor-pointer"
              />
              <img
                src={
                  post.user.avatar_url ||
                  `https://ui-avatars.com/api/?name=${post.user.name}`
                }
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold text-sm">
                {post.user.username}
              </span>
            </div>
            <MoreHorizontal size={20} />
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto px-4 py-3">

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

          {/* Action */}
          <div className="border-t px-4 py-3">
            <div className="flex gap-4 mb-2">
              <Heart
                size={24}
                onClick={() => setLiked(!liked)}
                className={
                  liked
                    ? "fill-red-500 text-red-500"
                    : "text-[#262626]"
                }
              />
              <MessageCircle size={24} />
              <Share2 size={24} />
              <Bookmark size={24} className="ml-auto" />
            </div>

            {replyUsername && (
              <div className="text-xs text-[#8e8e8e] mb-1">
                Membalas{" "}
                <span className="font-semibold">
                  @{replyUsername}
                </span>
                <button
                  onClick={() => {
                    setReplyTo(null)
                    setReplyUsername(null)
                  }}
                  className="ml-2 text-red-500"
                >
                  Batal
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmitComment()
                }
                placeholder="Tambahkan komentar..."
                className="flex-1 text-sm outline-none"
              />

              <button
                onClick={handleSubmitComment}
                className="text-[#0095f6] font-semibold text-sm"
              >
                Kirim
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
