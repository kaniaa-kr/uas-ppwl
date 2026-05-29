import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import Navbar from "../components/Navbar"
import { toast } from "sonner"
import { Grid, Heart, MessageCircle, LogOut, ArrowLeft } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

type ProfileUser = {
  id: string
  name: string
  username: string
  avatar_url: string | null
  bio: string | null
  followers_count?: number
  following_count?: number
}

type Post = {
  id: string
  content: string
  image_url: string | null
  created_at: string
  likes?: number // untuk kecocokan tipe data profile lama
  comments?: number
  _count?: { likes: number; comments: number } // untuk kecocokan tipe data userprofile lama
}

export default function ProfilePage() {
  const { username: urlUsername } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // Jika tidak ada username di URL, berarti sedang membuka profil sendiri
  // Jika ada username di URL dan nilainya sama dengan user yang sedang login, juga dianggap profil sendiri
  const isOwnProfile = !urlUsername || currentUser?.username === urlUsername
  
  // Tentukan username mana yang akan dicari datanya
  const targetUsername = isOwnProfile ? currentUser?.username : urlUsername

  useEffect(() => {
    if (!targetUsername) {
      setLoading(false)
      return
    }

    const fetchProfileData = async () => {
      setLoading(true)
      try {
        // 1. Fetch data profil pengguna (mencakup endpoint dari gabungan kedua halaman sebelumnya)
        // Gunakan endpoint fallback jika salah satu tidak merespon dengan baik
        const endpoint = isOwnProfile 
          ? `${API_URL}/users/username/${targetUsername}`
          : `${API_URL}/auth/profile/${targetUsername}`

        const userRes = await fetch(endpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        
        if (!userRes.ok) throw new Error("Pengguna tidak ditemukan")
        const userData = await userRes.json()
        setProfileUser(userData)

        // 2. Fetch postingan milik pengguna ini
        // Kita dukung kedua format endpoint postingan dari halaman sebelumnya agar fleksibel dengan backend-mu
        const postsEndpoint = isOwnProfile
          ? `${API_URL}/posts/user/${userData.id}`
          : `${API_URL}/posts?username=${targetUsername}`

        const postsRes = await fetch(postsEndpoint)
        if (postsRes.ok) {
          const postsData = await postsRes.json()
          setPosts(Array.isArray(postsData) ? postsData : postsData.posts ?? [])
        }
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat profil")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [targetUsername, isOwnProfile, token])

  const handleLogout = () => {
    logout()
    toast.success("Berhasil keluar")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-950 dark:text-neutral-50 transition-colors duration-200">
      <Navbar />

      {/* Container Utama */}
      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0 flex flex-col items-center">
        
        {/* Mobile Header (Hanya muncul jika melihat profil orang lain di HP) */}
        {!isOwnProfile && profileUser && (
          <div className="w-full md:hidden flex items-center gap-3 px-4 h-[48px] border-b border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-black sticky top-0 z-10">
            <button onClick={() => navigate(-1)} className="text-neutral-900 dark:text-neutral-100">
              <ArrowLeft size={24} strokeWidth={1.5} />
            </button>
            <span className="text-[16px] font-bold text-neutral-900 dark:text-neutral-100">
              {profileUser.username}
            </span>
          </div>
        )}

        <div className="w-full max-w-[935px] px-4 py-6 md:py-10">
          
          {loading ? (
            // ── SKELETON LOADING STATE ──
            <div className="animate-pulse flex flex-col gap-8">
              <div className="flex gap-6 md:gap-12 items-center">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 md:gap-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
                ))}
              </div>
            </div>
          ) : !profileUser ? (
            // ── ERROR / NOT FOUND STATE ──
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <h2 className="text-xl font-bold">Halaman tidak tersedia</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[340px]">
                Tautan yang Anda ikuti mungkin rusak, atau halaman mungkin telah dihapus.
              </p>
              <Link to="/" className="text-sm font-semibold text-[#0095f6] hover:underline mt-2">
                Kembali ke Beranda
              </Link>
            </div>
          ) : (
            // ── MAIN PROFILE CONTENT ──
            <>
              {/* Header Profil */}
              <header className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-16 pb-8 md:pb-12 border-b border-neutral-200 dark:border-neutral-800/80">
                
                {/* Foto Profil / Avatar */}
                <div className="mx-auto md:mx-0 flex-shrink-0">
                  <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                    <img
                      src={
                        profileUser.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          profileUser.name ?? "U"
                        )}&size=150&background=262626&color=ffffff`
                      }
                      alt={profileUser.username}
                      className="w-full h-full object-cover select-none"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name ?? "U")}&size=150`
                      }}
                    />
                  </div>
                </div>

                {/* Info & Detail Teks Profil */}
                <div className="flex-1 w-full flex flex-col gap-4">
                  {/* Baris 1: Username & Tombol Aksi */}
                  <div className="flex flex-wrap items-center gap-4">
                    <h2 className="text-[20px] font-normal text-neutral-900 dark:text-neutral-100">
                      {profileUser.username}
                    </h2>
                    
                    {isOwnProfile ? (
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <Link
                          to="/edit-profile"
                          className="flex-1 md:flex-none text-center bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-[14px] font-semibold px-4 py-1.5 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800"
                        >
                          Edit profil
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-500 hover:text-red-600 transition-colors border border-neutral-200 dark:border-neutral-800"
                          title="Keluar akun"
                        >
                          <LogOut size={18} strokeWidth={1.8} />
                        </button>
                      </div>
                    ) : (
                      <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold px-6 py-1.5 rounded-lg transition-colors shadow-sm w-full md:w-auto">
                        Ikuti
                      </button>
                    )}
                  </div>

                  {/* Baris 2: Statistik Angka */}
                  <ul className="flex items-center gap-6 md:gap-10 text-[14px] md:text-[16px]">
                    <li>
                      <span className="font-semibold text-neutral-950 dark:text-neutral-50">{posts.length}</span> kiriman
                    </li>
                    <li className="cursor-pointer hover:opacity-80">
                      <span className="font-semibold text-neutral-950 dark:text-neutral-50">{profileUser.followers_count ?? 0}</span> pengikut
                    </li>
                    <li className="cursor-pointer hover:opacity-80">
                      <span className="font-semibold text-neutral-950 dark:text-neutral-50">{profileUser.following_count ?? 0}</span> mengikuti
                    </li>
                  </ul>

                  {/* Baris 3: Nama Lengkap & Bio */}
                  <div className="text-[14px] leading-relaxed">
                    <h1 className="font-semibold text-neutral-950 dark:text-neutral-50">
                      {profileUser.name}
                    </h1>
                    {profileUser.bio && (
                      <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap mt-0.5">
                        {profileUser.bio}
                      </p>
                    )}
                  </div>
                </div>
              </header>

              {/* Navigasi Tab Content (Gaya Minimalis ala IG) */}
              <div className="flex justify-center border-t border-transparent">
                <div className="flex items-center gap-12 text-xs font-semibold tracking-wider uppercase text-neutral-950 dark:text-neutral-50 border-t border-neutral-950 dark:border-neutral-50 pt-4 -mt-[1px]">
                  <span className="flex items-center gap-1.5 cursor-pointer">
                    <Grid size={12} strokeWidth={2.5} />
                    Kiriman
                  </span>
                </div>
              </div>

              {/* Grid Dokumentasi / Postingan */}
              {posts.length === 0 ? (
                // State jika user belum memposting apapun
                <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                  <div className="w-14 h-14 rounded-full border border-neutral-400 dark:border-neutral-600 flex items-center justify-center text-xl">
                    📸
                  </div>
                  <h3 className="text-xl font-bold mt-2">Belum Ada Kiriman</h3>
                  {isOwnProfile && (
                    <Link to="/create" className="text-sm font-semibold text-[#0095f6] hover:text-[#1877f2]">
                      Bagikan foto pertama Anda
                    </Link>
                  )}
                </div>
              ) : (
                // Tampilan Grid 3 Kolom
                <div className="grid grid-cols-3 gap-1 md:gap-6 mt-6">
                  {posts.map((post) => {
                    // Normalisasi hitungan likes & comments dari skema data yang berbeda
                    const likesCount = post.likes ?? post._count?.likes ?? 0
                    const commentsCount = post.comments ?? post._count?.comments ?? 0

                    return (
                      <Link
                        key={post.id}
                        to={`/post/${post.id}`}
                        className="relative aspect-square group block bg-neutral-100 dark:bg-neutral-900 md:rounded-sm overflow-hidden border border-neutral-200 dark:border-neutral-800/40"
                      >
                        {/* Image Kiriman atau Konten Teks Fallback */}
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.content || "Kiriman pengguna"}
                            className="w-full h-full object-cover select-none transition duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-3 text-center transition duration-300 group-hover:scale-105">
                            <p className="text-[12px] md:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-4 font-medium">
                              {post.content}
                            </p>
                          </div>
                        )}
                        
                        {/* Hover Overlay (Menampilkan Likes & Comments) */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 md:gap-6 text-white font-bold text-sm md:text-base">
                          <span className="flex items-center gap-1 md:gap-1.5">
                            <Heart size={20} fill="currentColor" />
                            {likesCount}
                          </span>
                          <span className="flex items-center gap-1 md:gap-1.5">
                            <MessageCircle size={20} fill="currentColor" />
                            {commentsCount}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}