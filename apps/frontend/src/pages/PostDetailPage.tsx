import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import Navbar from "../components/Navbar"
import { toast } from "sonner"
import { Heart, MessageCircle, Trash2, ArrowLeft } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)

  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/posts/${id}`)
        if (!res.ok) throw new Error("Kiriman tidak ditemukan")
        const data = await res.json()
        setPost(data)
        setLikesCount(data.likes ?? 0)
        
        // Cek status like
        if (currentUser && token) {
          const likeRes = await fetch(`${API_URL}/posts/${id}/like-status`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (likeRes.ok) {
            const likeData = await likeRes.json()
            setIsLiked(likeData.is_liked)
          }
        }

        // Fetch comments
        const commentsRes = await fetch(`${API_URL}/posts/${id}/comments`)
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json()
          setComments(commentsData)
        }
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat kiriman")
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPostDetails()
  }, [id, currentUser, token, navigate])

  const handleDeletePost = async () => {
    if (!confirm("Yakin ingin menghapus kiriman ini?")) return
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Gagal menghapus kiriman")
      toast.success("Kiriman berhasil dihapus")
      navigate(`/profile/${currentUser?.username}`)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleToggleLike = async () => {
    if (!currentUser) return toast.error("Silakan login terlebih dahulu")
    
    // Optimistic UI update
    const previousIsLiked = isLiked
    const previousLikesCount = likesCount
    
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)

    try {
      const res = await fetch(`${API_URL}/posts/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
    } catch {
      // Revert if failed
      setIsLiked(previousIsLiked)
      setLikesCount(previousLikesCount)
      toast.error("Gagal menyukai kiriman")
    }
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUser) return

    setSubmittingComment(true)
    try {
      const res = await fetch(`${API_URL}/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment.trim() }),
      })
      
      if (!res.ok) throw new Error("Gagal mengirim komentar")
      const addedComment = await res.json()
      
      // Inject user object agar langsung muncul tanpa direfresh
      const commentWithUser = { ...addedComment, user: currentUser }
      setComments((prev) => [...prev, commentWithUser])
      setNewComment("")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-950 dark:text-neutral-50 transition-colors duration-200">
      <Navbar />

      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[1000px] p-0 md:p-6 lg:p-8">
          
          {loading ? (
            // SKELETON
            <div className="w-full flex flex-col md:flex-row bg-white dark:bg-neutral-950 md:border border-neutral-200 dark:border-neutral-800 md:rounded-sm overflow-hidden h-[calc(100vh-48px)] md:h-[600px] animate-pulse">
              <div className="w-full md:w-[55%] lg:w-[60%] h-[50vh] md:h-full bg-neutral-200 dark:bg-neutral-900" />
              <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col p-4 border-l border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="w-24 h-4 rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="w-3/4 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="w-1/2 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
              </div>
            </div>
          ) : !post ? (
            // NOT FOUND
            <div className="text-center py-20">
              <h2 className="text-xl font-bold">Kiriman tidak ditemukan</h2>
              <button onClick={() => navigate("/")} className="mt-4 text-[#0095f6] font-semibold hover:underline">
                Kembali ke Beranda
              </button>
            </div>
          ) : (
            // MAIN CONTENT (IG Desktop Style)
            <div className="w-full flex flex-col md:flex-row bg-white dark:bg-black md:border border-neutral-200 dark:border-neutral-800 md:rounded-sm overflow-hidden min-h-[calc(100vh-48px)] md:min-h-0 md:h-[600px] lg:h-[700px]">
              
              {/* Kiri: Gambar Kiriman */}
              <div className="w-full md:w-[55%] lg:w-[60%] bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center relative">
                {/* Back button untuk mobile */}
                <button 
                  onClick={() => navigate(-1)}
                  className="md:hidden absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-sm"
                >
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={post.image_url}
                  alt="Post content"
                  className="w-full h-full object-contain md:object-cover"
                />
              </div>

              {/* Kanan: Sidebar Detail & Komentar */}
              <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col bg-white dark:bg-black border-l border-neutral-200 dark:border-neutral-800">
                
                {/* Header Kanan (Profil & Delete) */}
                <div className="flex items-center justify-between p-3.5 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.user.username}`} className="flex-shrink-0">
                      <img
                        src={post.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=262626&color=ffffff`}
                        alt={post.user.username}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
                      />
                    </Link>
                    <Link to={`/profile/${post.user.username}`} className="text-sm font-semibold hover:text-neutral-500 transition-colors">
                      {post.user.username}
                    </Link>
                  </div>
                  {currentUser?.id === post.user_id && (
                    <button 
                      onClick={handleDeletePost}
                      className="p-1.5 text-neutral-500 hover:text-red-500 transition-colors"
                      title="Hapus kiriman"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* Area Komentar & Caption (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 hide-scrollbar">
                  {/* Caption (ditampilkan seperti komentar pertama) */}
                  {post.content && (
                    <div className="flex gap-3">
                      <Link to={`/profile/${post.user.username}`} className="flex-shrink-0 mt-1">
                        <img
                          src={post.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=262626&color=ffffff`}
                          alt={post.user.username}
                          className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
                        />
                      </Link>
                      <div className="flex-1 text-sm pt-0.5">
                        <Link to={`/profile/${post.user.username}`} className="font-semibold hover:underline mr-1.5">
                          {post.user.username}
                        </Link>
                        <span className="whitespace-pre-wrap">{post.content}</span>
                      </div>
                    </div>
                  )}

                  {/* List Komentar */}
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <Link to={`/profile/${comment.user.username}`} className="flex-shrink-0 mt-1">
                        <img
                          src={comment.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}&background=262626&color=ffffff`}
                          alt={comment.user.username}
                          className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
                        />
                      </Link>
                      <div className="flex-1 text-sm pt-0.5">
                        <Link to={`/profile/${comment.user.username}`} className="font-semibold hover:underline mr-1.5">
                          {comment.user.username}
                        </Link>
                        <span className="whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">{comment.content}</span>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && !post.content && (
                    <div className="h-full flex items-center justify-center text-center text-sm text-neutral-500">
                      Belum ada komentar.<br/>Jadilah yang pertama!
                    </div>
                  )}
                </div>

                {/* Footer Kanan (Actions, Likes, Input Komentar) */}
                <div className="border-t border-neutral-200 dark:border-neutral-800">
                  {/* Action Icons */}
                  <div className="p-3.5 flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={handleToggleLike}
                        className="hover:opacity-60 transition-opacity"
                      >
                        <Heart 
                          size={26} 
                          className={isLiked ? "fill-red-500 text-red-500" : "text-neutral-900 dark:text-neutral-100"} 
                        />
                      </button>
                      <button className="hover:opacity-60 transition-opacity">
                        <MessageCircle size={26} className="text-neutral-900 dark:text-neutral-100" />
                      </button>
                    </div>
                    <div className="text-sm font-semibold mt-1">
                      {likesCount} suka
                    </div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wide">
                      {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Input Form Komentar */}
                  <form 
                    onSubmit={handlePostComment}
                    className="flex items-center px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Tambahkan komentar..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none placeholder-neutral-500 dark:text-neutral-100"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
                      className="text-sm font-semibold text-[#0095f6] hover:text-[#1877f2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Kirim
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}