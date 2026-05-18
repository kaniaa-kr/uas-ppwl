import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react"
import Navbar from "../components/Navbar";
import CommentItem from "../components/CommentItem"
import { toast } from "sonner"

type Post = {
  id: string
  content: string
  image_url?: string
  user: {
    name: string
    username: string
    avatar_url?: string
  }
  _count: {
    likes: number
    comments: number
  }
}

type Comment = {
  id: string
  content: string
  created_at: string
  user: {
    id: string
    name: string
    avatar_url?: string
  }
}

const API_URL = import.meta.env.VITE_API_URL

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [postRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/posts/${id}`),
        fetch(`${API_URL}/comments/post/${id}`),
      ])

      if (!postRes.ok) throw new Error("Post tidak ditemukan")

      const postData = await postRes.json()
      const commentsData = (await commentsRes.json()) || []

      setPost(postData)
      setComments(Array.isArray(commentsData) ? commentsData : [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Gagal memuat postingan")
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="text-center p-8 text-gray-400">Post tidak ditemukan</div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 mb-4 hover:text-black transition"
        >
          <ArrowLeft size={20} /> Kembali
        </button>

        {/* Post detail */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">
          {/* Header */}
          <div className="flex items-center gap-3 p-4">
            <img
              src={
                post.user.avatar_url ||
                `https://ui-avatars.com/api/?name=${post.user.name}`
              }
              alt={post.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{post.user.name}</p>
              <p className="text-xs text-gray-400">@{post.user.username}</p>
            </div>
          </div>

          {/* Image */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt="post"
              className="w-full aspect-square object-cover"
            />
          )}

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-gray-800 leading-relaxed">{post.content}</p>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 flex items-center gap-4 text-gray-500 border-t">
            <button className="flex items-center gap-2 hover:text-red-500 transition flex-1 justify-center py-2">
              <Heart size={20} />
              <span className="text-sm">{post._count.likes} suka</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition flex-1 justify-center py-2">
              <MessageCircle size={20} />
              <span className="text-sm">{post._count.comments} komentar</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500 transition flex-1 justify-center py-2">
              <Share2 size={20} />
              <span className="text-sm">Bagikan</span>
            </button>
          </div>
        </div>

        {/* Comments section */}
        <div>
          <h2 className="font-bold text-lg mb-4">
            Komentar ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Belum ada komentar</p>
              <p className="text-gray-300 text-sm mt-1">Jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  id={comment.id}
                  author={comment.user}
                  content={comment.content}
                  createdAt={comment.created_at}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}