import { useEffect, useState } from "react"
import { useAuthStore } from "../stores/auth.store"
import Navbar from "../components/Navbar"
import PostCard from "../components/PostCard"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import { PlusSquare } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const currentUser = useAuthStore((s) => s.user)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts`)
        if (!res.ok) throw new Error("Gagal load posts")
        const data = await res.json()
        setPosts(data)
      } catch (error) {
        toast.error("Gagal memuat postingan")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handlePostDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Content Area */}
      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0">
        <div className="max-w-[935px] mx-auto flex justify-center lg:justify-start lg:gap-[64px] px-0 md:px-5 lg:pt-8">

          {/* Main Feed */}
          <main className="w-full max-w-[470px]">
            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 rounded-full border-2 border-[#363636] border-t-[#737373] animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!loading && posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#363636] flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <p className="text-white font-semibold text-xl">Belum ada postingan</p>
                <p className="text-sm text-[#737373] text-center">
                  Jadilah yang pertama berbagi foto atau cerita!
                </p>
                <Link
                  to="/create"
                  className="flex items-center gap-2 bg-[#0095f6] text-white text-[14px] font-semibold px-5 py-2 rounded-lg hover:bg-[#1877f2] transition-colors"
                >
                  <PlusSquare size={18} />
                  Buat Postingan
                </Link>
              </div>
            )}

            {/* Posts */}
            <div className="flex flex-col gap-0 md:gap-5 md:mt-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  content={post.content}
                  image_url={post.image_url}
                  user={post.user}
                  likes={post._count.likes}
                  comments={post._count.comments}
                  onDeleted={handlePostDeleted}
                />
              ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block w-[319px] pt-4 flex-shrink-0">
            {/* Current user profile */}
            {currentUser && (
              <div className="flex items-center justify-between mb-6">
                <Link to="/profile" className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      currentUser.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&size=64&background=262626&color=ffffff`
                    }
                    alt="avatar"
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-white truncate leading-tight">
                      {currentUser.username}
                    </p>
                    <p className="text-[13px] text-[#737373] truncate mt-0.5 leading-tight">
                      {currentUser.name}
                    </p>
                  </div>
                </Link>
                <Link
                  to="/profile"
                  className="text-xs font-semibold text-[#0095f6] hover:text-white transition-colors"
                >
                  Lihat Profil
                </Link>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#737373]">Saran untuk kamu</p>
              <Link
                to="/create"
                className="text-xs font-semibold text-[#0095f6] hover:text-white flex items-center gap-1 transition-colors"
              >
                <PlusSquare size={14} />
                Buat
              </Link>
            </div>

            {/* Suggested users (from feed) */}
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-[#262626]">
                  <img
                    src={
                      post.user.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&size=64&background=262626&color=ffffff`
                    }
                    alt={post.user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate leading-tight">
                    {post.user.username}
                  </p>
                  <p className="text-[13px] text-[#737373] truncate mt-0.5 leading-tight">
                    {post.content}
                  </p>
                </div>
                <Link
                  to={`/profile/${post.user.username}`}
                  className="text-xs font-semibold text-[#0095f6] hover:text-white transition-colors flex-shrink-0"
                >
                  Ikuti
                </Link>
              </div>
            ))}

            {/* Footer */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-x-1 gap-y-1 text-[#4a4a4a] text-[12px]">
                <a href="#" className="hover:text-[#737373] hover:underline">Tentang</a> ·
                <a href="#" className="hover:text-[#737373] hover:underline">Bantuan</a> ·
                <a href="#" className="hover:text-[#737373] hover:underline">Privasi</a> ·
                <a href="#" className="hover:text-[#737373] hover:underline">Ketentuan</a>
              </div>
              <p className="text-[#4a4a4a] text-[12px] mt-2 uppercase tracking-wider">
                © 2026 INSUTA
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
