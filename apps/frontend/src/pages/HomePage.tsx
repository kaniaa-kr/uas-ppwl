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
    <div className="min-h-screen bg-white dark:bg-black text-neutral-950 dark:text-neutral-50 transition-colors duration-200">
      <Navbar />

      {/* Content Area */}
      <div className="md:ml-[72px] lg:ml-[244px] pt-[60px] md:pt-0 pb-[52px] md:pb-0 flex justify-center">
        
        {/* Kontainer Utama membatasi lebar konten ala IG (sekitar 850px) */}
        <div className="w-full max-w-[850px] flex justify-center gap-[64px] px-0 md:px-4 py-4 md:py-8">
          
          {/* ── SEKSI UTAMA POSTINGAN (KIRI) ── */}
          <div className="w-full max-w-[470px] flex flex-col gap-6">
            {loading ? (
              // Loading Skeleton State
              <div className="flex flex-col gap-6 w-full animate-pulse mt-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-4 md:px-0">
                      <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                      <div className="w-24 h-4 rounded bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                    <div className="w-full aspect-square md:rounded-sm bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              // Empty State jika tidak ada postingan
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4 mx-4 md:mx-0 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl bg-neutral-50 dark:bg-neutral-900/20 px-6">
                <p className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">Belum ada postingan</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[280px]">
                  Mulai bagikan momen berhargamu atau ikuti orang lain.
                </p>
                <Link
                  to="/create"
                  className="mt-2 flex items-center gap-2 text-sm bg-[#0095f6] hover:bg-[#1877f2] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
                >
                  <PlusSquare size={18} />
                  Buat Postingan Pertama
                </Link>
              </div>
            ) : (
              // Daftar Postingan Aktif
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  content={post.content}
                  image_url={post.image_url}
                  user={post.user}
                  likes={post.likes ?? 0}
                  comments={post.comments ?? 0}
                  onDeleted={handlePostDeleted}
                />
              ))
            )}
          </div>

          {/* ── SIDEBAR REKOMENDASI (KANAN) ── */}
          {/* Hanya muncul di layar besar (lg ke atas), tersembunyi di mobile/tablet */}
          <div className="hidden lg:block w-[320px] pt-4 flex-shrink-0">
            
            {/* Profil Ringkas Pengguna Login Aktif */}
            {currentUser && (
              <div className="flex items-center gap-4 mb-6">
                <Link to={`/profile/${currentUser.username}`} className="flex-shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                    <img
                      src={
                        currentUser.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          currentUser.name ?? "U"
                        )}&size=96&background=262626&color=ffffff`
                      }
                      alt={currentUser.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/profile/${currentUser.username}`}
                    className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 transition-colors block truncate"
                  >
                    {currentUser.username}
                  </Link>
                  <p className="text-[14px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {currentUser.name}
                  </p>
                </div>
                {/* Tombol aksi seperti Beralih/Switch akun di IG */}
                <div className="text-xs font-semibold text-[#0095f6] hover:text-[#1877f2] cursor-pointer transition-colors">
                  Beralih
                </div>
              </div>
            )}

            {/* Kotak Rekomendasi / Saran Akun */}
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Disarankan untuk Anda
              </span>
              <button className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 transition-colors">
                Lihat Semua
              </button>
            </div>

            {/* Daftar saran berdasarkan pembuat post (dummy implementasi dari postingan teratas) */}
            <div className="flex flex-col gap-4">
              {posts.slice(0, 5).map((post, idx) => (
                <div key={`${post.id}-${idx}`} className="flex items-center gap-3 group">
                  <Link to={`/profile/${post.user.username}`} className="flex-shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900">
                      <img
                        src={
                          post.user.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            post.user.name ?? "U"
                          )}&size=64&background=262626&color=ffffff`
                        }
                        alt={post.user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link 
                      to={`/profile/${post.user.username}`}
                      className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 transition-colors truncate block"
                    >
                      {post.user.username}
                    </Link>
                    <p className="text-[12px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      Disarankan untuk Anda
                    </p>
                  </div>
                  <Link
                    to={`/profile/${post.user.username}`}
                    className="text-xs font-semibold text-[#0095f6] hover:text-[#1877f2] transition-colors flex-shrink-0"
                  >
                    Ikuti
                  </Link>
                </div>
              ))}
            </div>

            {/* Footer Links (About, Help, etc.) */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-x-1.5 gap-y-1.5 text-neutral-400 dark:text-neutral-500 text-[12px]">
                <a href="#" className="hover:underline">Tentang</a> ·
                <a href="#" className="hover:underline">Bantuan</a> ·
                <a href="#" className="hover:underline">Pers</a> ·
                <a href="#" className="hover:underline">API</a> ·
                <a href="#" className="hover:underline">Pekerjaan</a> ·
                <a href="#" className="hover:underline">Privasi</a> ·
                <a href="#" className="hover:underline">Ketentuan</a> ·
                <a href="#" className="hover:underline">Lokasi</a> ·
                <a href="#" className="hover:underline">Bahasa</a> ·
                <a href="#" className="hover:underline">Meta Verified</a>
              </div>
              <p className="text-neutral-400 dark:text-neutral-500 text-[12px] mt-4 uppercase tracking-wider">
                © 2026 INSUTA
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}