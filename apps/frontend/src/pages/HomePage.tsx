import { useEffect, useState } from "react"
import { useAuthStore } from "../stores/auth.store"
import Navbar from "../components/Navbar"
import PostCard from "../components/PostCard"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      {/* Content Area */}
      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0">
        <div className="max-w-[935px] mx-auto flex justify-center lg:justify-start lg:gap-[64px] px-0 md:px-5 lg:pt-8">
          
          {/* Main Feed */}
          <main className="w-full max-w-[470px]">
            {/* Loading */}
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
                <p className="text-sm text-[#737373]">Ikuti seseorang untuk melihat fotonya!</p>
              </div>
            )}

            {/* Posts */}
            <div className="flex flex-col gap-4 md:gap-5 md:mt-4">
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
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block w-[319px] pt-4 flex-shrink-0">
            {/* Suggested users placeholder */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#737373]">Disarankan untuk Anda</p>
              <button className="text-xs font-semibold text-[#262626] hover:text-[#737373]">Lihat Semua</button>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { username: "sipaling_makan", name: "Foodie JKT" },
                { username: "tukang_jalan", name: "Traveler" },
                { username: "kucing_oren", name: "Cat Lover" },
              ].map((u) => (
                <div key={u.username} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=64&background=e0e0e0&color=757575`}
                      alt={u.username}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#262626] leading-none">{u.username}</p>
                      <p className="text-[13px] text-[#737373] mt-1 leading-none">Disarankan untuk Anda</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-[#0095f6] hover:text-[#00376b] transition-colors">
                    Ikuti
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-x-1 gap-y-1 text-[#c7c7c7] text-[12px]">
                <a href="#" className="hover:underline">Tentang</a> ·
                <a href="#" className="hover:underline">Bantuan</a> ·
                <a href="#" className="hover:underline">Pers</a> ·
                <a href="#" className="hover:underline">API</a> ·
                <a href="#" className="hover:underline">Pekerjaan</a> ·
                <a href="#" className="hover:underline">Privasi</a> ·
                <a href="#" className="hover:underline">Ketentuan</a>
              </div>
              <p className="text-[#c7c7c7] text-[12px] mt-4 uppercase">
                © 2026 INSTAGRAM CLONE PPWL
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
