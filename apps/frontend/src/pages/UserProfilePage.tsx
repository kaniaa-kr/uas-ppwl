import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import Navbar from "../components/Navbar"
import { toast } from "sonner"
import { ArrowLeft, Grid3X3 } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

type ProfileUser = {
  id: string
  name: string
  username: string
  avatar_url: string | null
  bio: string | null
}

type Post = {
  id: string
  content: string
  image_url: string | null
  created_at: string
  _count: { likes: number; comments: number }
}

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser?.username === username) {
      navigate("/profile", { replace: true })
    }
  }, [currentUser, username, navigate])

  useEffect(() => {
    if (!username) return
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/profile/${username}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) throw new Error("User tidak ditemukan")
        const data = await res.json()
        setProfileUser(data)
      } catch {
        toast.error("Gagal load profil")
      }
    }
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts?username=${username}`)
        if (!res.ok) return
        const data = await res.json()
        setPosts(Array.isArray(data) ? data : data.posts ?? [])
      } catch {
        // posts optional
      }
    }
    Promise.all([fetchProfile(), fetchPosts()]).finally(() => setLoading(false))
  }, [username, token])

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 rounded-full border-2 border-[#363636] border-t-[#737373] animate-spin" />
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0">
          <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
            <p className="text-white font-semibold text-xl">Pengguna tidak ditemukan</p>
            <button
              onClick={() => navigate(-1)}
              className="text-[#0095f6] text-sm hover:text-white transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0">

        {/* Mobile back button */}
        <div className="md:hidden flex items-center gap-3 px-4 h-[44px] border-b border-[#262626] bg-black">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <span className="text-[16px] font-semibold text-white">
            {profileUser.username}
          </span>
        </div>

        <div className="max-w-[935px] mx-auto px-4 py-6 md:py-10">
          {/* Profile header */}
          <div className="flex items-center gap-6 md:gap-[80px] mb-8">
            <div className="w-[77px] h-[77px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden bg-[#262626] flex-shrink-0">
              <img
                src={
                  profileUser.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&size=150&background=262626&color=ffffff`
                }
                alt={profileUser.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <h1 className="text-[20px] md:text-[28px] font-light text-white">
                  {profileUser.username}
                </h1>
              </div>

              {/* Stats */}
              <div className="flex gap-6 md:gap-9 mb-4">
                <div className="text-center md:text-left">
                  <span className="font-semibold text-white text-[14px]">
                    {posts.length}
                  </span>
                  <span className="text-[14px] text-white ml-1">postingan</span>
                </div>
              </div>

              {/* Name & bio */}
              <div>
                <p className="text-[14px] font-semibold text-white">
                  {profileUser.name}
                </p>
                {profileUser.bio && (
                  <p className="text-[14px] text-[#a0a0a0] mt-1 whitespace-pre-line">
                    {profileUser.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Posts grid */}
          <div className="border-t border-[#262626] pt-4">
            <div className="flex items-center gap-2 justify-center mb-4">
              <Grid3X3 size={12} className="text-[#737373]" />
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#737373]">
                Postingan
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-white font-semibold">Belum ada postingan</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-[3px]">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="aspect-square bg-[#1a1a1a] overflow-hidden cursor-pointer relative group"
                  >
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2 bg-[#1a1a1a] group-hover:bg-[#262626]">
                        <p className="text-[11px] text-[#737373] text-center line-clamp-4">
                          {post.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
