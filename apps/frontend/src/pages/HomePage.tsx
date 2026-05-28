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
    /* bg app shell */
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      {/* content area — offset for sidebar on desktop, header+bottom on mobile */}
      <div className="lg:ml-[244px] xl:ml-[335px]">
        <div className="max-w-[935px] mx-auto lg:flex lg:gap-8 lg:px-4 xl:px-8 lg:pt-8">

          {/* ── Feed column ──────────────────────────────────────────── */}
          <main className="w-full lg:max-w-[470px]">
            {/* top spacing for mobile sticky header */}
            <div className="h-[54px] lg:hidden" />

            {/* Loading skeleton */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 rounded-full border-2 border-[#dbdbdb] border-t-[#737373] animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!loading && posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-[#262626] flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <p className="text-[#262626] font-semibold text-xl">Belum ada postingan</p>
                <p className="text-sm text-[#737373]">Jadilah yang pertama berbagi foto!</p>
              </div>
            )}

            {/* Posts feed */}
            <div className="flex flex-col">
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

            {/* bottom spacing for mobile bottom-nav */}
            <div className="h-[49px] lg:hidden" />
          </main>

          {/* ── Desktop right panel ───────────────────────────────────── */}
          <aside className="hidden lg:block flex-shrink-0 w-[293px] xl:w-[319px] pt-2">
            {/* Suggested users placeholder */}
            <p className="text-sm font-semibold text-[#737373] mb-4">Saran untukmu</p>
            {[
              { username: "suggested_user1", name: "Pengguna 1" },
              { username: "suggested_user2", name: "Pengguna 2" },
              { username: "suggested_user3", name: "Pengguna 3" },
            ].map((u) => (
              <div key={u.username} className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=64&background=e0e0e0&color=757575`}
                    alt={u.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#262626] leading-tight">{u.username}</p>
                    <p className="text-xs text-[#737373] leading-tight">Saran untukmu</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-[#0095f6] hover:text-[#00376b] transition-colors">
                  Ikuti
                </button>
              </div>
            ))}

            {/* Footer */}
            <div className="mt-6">
              <p className="text-[10px] text-[#c7c7c7] leading-relaxed">
                Tentang · Bantuan · Pers · API · Pekerjaan · Privasi · Ketentuan · Lokasi · Bahasa
              </p>
              <p className="text-[10px] text-[#c7c7c7] mt-2">
                © 2026 INSTAGRAM FROM META
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
