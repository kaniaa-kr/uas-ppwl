import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import PostCard from "../components/PostCard"
import { toast } from "sonner"

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
    comments: number
  }
}

const API_URL = import.meta.env.VITE_API_URL

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/posts`)
      if (!res.ok) throw new Error("Gagal fetch posts")
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Gagal memuat postingan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Pull-to-refresh hint */}
        <div className="text-center text-gray-400 text-xs mb-4">
          📱 Geser ke bawah untuk refresh
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-gray-400">Belum ada postingan</p>
            <p className="text-sm text-gray-300 mt-1">
              Jadilah yang pertama posting!
            </p>
          </div>
        )}

        {/* Posts feed */}
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              content={post.content}
              image_url={post.image_url}
              user={post.user}
              likes={post._count.likes}
              comments={post._count.comments}
            />
          ))}
        </div>
      </div>
    </>
  )
}