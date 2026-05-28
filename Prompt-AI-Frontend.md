Tolong refactor SELURUH komponen dan halaman React di bawah ini menggunakan Tailwind CSS dan Lucide React. 
Saya ingin merubah stylingnya agar terlihat sangat profesional, modern, dan sangat mirip dengan desain UI asli Instagram (Clean, minimalis, border tipis, flat design tanpa shadow tebal).

ATURAN SANGAT PENTING:
1. JANGAN ubah nama file atau struktur folder.
2. JANGAN ubah props pada komponen manapun.
3. JANGAN ubah state management (Zustand) atau logic fetch datanya.
4. HANYA ubah className Tailwind dan struktur susunan JSX (HTML) nya saja agar lebih aesthetic dan responsif.
5. Berikan saya kode utuh untuk setiap file yang diubah.

Detail spesifik:
- **Global/Layout**: Gunakan background putih/abu-abu sangat terang, responsif untuk mobile (bottom navigation) dan desktop (sidebar kiri).
- **Auth Pages**: Buat desain form login & register yang sleek, menempatkan form di tengah layar dengan styling minimalis, border tipis, dan typography yang rapi.
- **Navbar**: Buat header sticky top berisi logo di mobile dengan bottom navigation bar, dan jadikan sidebar kiri untuk layar desktop besar.
- **PostCard & Detail**: Hilangkan bayangan (shadow), buat gambar terentang full width edge-to-edge untuk mobile, pindahkan icon Like/Comment/Share berjejer ke bawah gambar di sebelah kiri, dan letakkan teks jumlah likes dan caption di bawah icon dengan username yang di-bold.
- **Comments & Notifications**: Desain list yang rapi, avatar membulat sempurna, margin yang pas, dan divider tipis antar item untuk kesan clean.

Berikut adalah kode sumber dari frontend aplikasi saya:



### File: `apps/frontend/src/pages/LoginPage.tsx`
```tsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email dan password wajib diisi")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Login gagal")
        return
      }

      setAuth(data.user, data.accessToken)
      toast.success(`Selamat Datang, ${data.user.name}! 👋`)
      navigate("/")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Terjadi kesalahan, coba lagi")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-4xl mb-2">📸</h1>
          <h2 className="text-2xl font-bold">Instagram Clone</h2>
          <p className="text-gray-500 text-sm mt-1">Minggu 15 PPWL</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {loading ? "Sedang masuk..." : "Masuk"}
          </button>
        </div>

        <div className="my-4 flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-xs">atau</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-500 font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
```


### File: `apps/frontend/src/pages/RegisterPage.tsx`
```tsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async () => {
    // Validasi
    if (!form.name || !form.username || !form.email || !form.password) {
      toast.error("Semua field wajib diisi")
      return
    }

    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Registrasi gagal")
        return
      }

      setAuth(data.user, data.accessToken)
      toast.success(
        `Akun berhasil dibuat! Selamat datang, ${data.user.name}! 🎉`
      )
      navigate("/")
    } catch (error) {
      console.error("Register error:", error)
      toast.error("Terjadi kesalahan, coba lagi")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
          <p className="text-gray-500 text-sm mt-1">Bergabung dengan kami</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            name="name"
            type="text"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="username"
            type="text"
            placeholder="Username (tanpa spasi)"
            value={form.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min. 6 karakter)"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition"
          >
            {loading ? "Sedang mendaftar..." : "Daftar"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
```


### File: `apps/frontend/src/pages/HomePage.tsx`
```tsx
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
```


### File: `apps/frontend/src/pages/PostDetailPage.tsx`
```tsx
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
```


### File: `apps/frontend/src/pages/NotificationPage.tsx`
```tsx
import { useState } from "react"
import NotificationItem from "../components/NotificationItem"
import type { Notification } from "../stores/notification.store"

const dummyNotifications: Notification[] = [
  {
    id: "1",
    user_id: "99",
    actor_id: "1",
    type: "like",
    post_id: "10",
    comment_id: null,
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    actor: { id: "1", name: "Budi Santoso", username: "budi_s", avatar_url: null },
    post: { id: "10", content: "Sunset di pantai Bali 🌅", image_url: null },
  },
  {
    id: "2",
    user_id: "99",
    actor_id: "2",
    type: "comment",
    post_id: "10",
    comment_id: "5",
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actor: { id: "2", name: "Siti Rahayu", username: "siti_r", avatar_url: null },
    post: { id: "10", content: "Sunset di pantai Bali 🌅", image_url: null },
  },
  {
    id: "3",
    user_id: "99",
    actor_id: "3",
    type: "like",
    post_id: "11",
    comment_id: null,
    is_read: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { id: "3", name: "Andi Wijaya", username: "andi_w", avatar_url: null },
    post: { id: "11", content: "Makan siang enak hari ini 🍜", image_url: null },
  },
  {
    id: "4",
    user_id: "99",
    actor_id: "4",
    type: "comment",
    post_id: "11",
    comment_id: "6",
    is_read: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { id: "4", name: "Dewi Lestari", username: "dewi_l", avatar_url: null },
    post: { id: "11", content: "Makan siang enak hari ini 🍜", image_url: null },
  },
  {
    id: "5",
    user_id: "99",
    actor_id: "5",
    type: "like",
    post_id: "12",
    comment_id: null,
    is_read: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { id: "5", name: "Raka Pratama", username: "raka_p", avatar_url: null },
    post: { id: "12", content: "Foto bareng teman-teman 📸", image_url: null },
  },
]

type FilterType = "semua" | "like" | "comment"

function getGroup(createdAt: string): "Hari ini" | "Minggu ini" | "Lebih Awal" {
  const diff = Date.now() - new Date(createdAt).getTime()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 1) return "Hari ini"
  if (days < 7) return "Minggu ini"
  return "Lebih Awal"
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications)
  const [filter, setFilter] = useState<FilterType>("semua")

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const filtered = notifications.filter((n) => {
    if (filter === "semua") return true
    return n.type === filter
  })

  const groups: ("Hari ini" | "Minggu ini" | "Lebih Awal")[] = [
    "Hari ini",
    "Minggu ini",
    "Lebih Awal",
  ]

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const tabs: { label: string; value: FilterType }[] = [
    { label: "Semua", value: "semua" },
    { label: "Like", value: "like" },
    { label: "Komentar", value: "comment" },
  ]

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Notifikasi</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount} baru
            </span>
          )}
        </div>
      </div>

      {/* Filter Tab */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === tab.value
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grouped List */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p>Belum ada notifikasi</p>
        </div>
      ) : (
        groups.map((group) => {
          const items = filtered.filter((n) => getGroup(n.created_at) === group)
          if (items.length === 0) return null
          return (
            <div key={group} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">{group}</h2>
              <div className="flex flex-col gap-2">
                {items.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
```


### File: `apps/frontend/src/components/Navbar.tsx`
```tsx
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { Bell, LogOut, Home } from "lucide-react"
import { toast } from "sonner"

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success("Logout berhasil")
    navigate("/login")
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2 hover:opacity-75 transition"
        >
          📸 <span className="text-lg">InstaClone</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Home */}
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-500 transition"
            title="Beranda"
          >
            <Home size={24} />
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="text-gray-600 hover:text-red-500 transition relative"
            title="Notifikasi"
          >
            <Bell size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition">
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${user?.name}`
              }
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-semibold hidden sm:inline">
              {user?.name}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 transition"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}
```


### File: `apps/frontend/src/components/PostCard.tsx`
```tsx
import { Link } from "react-router-dom"
import { Heart, MessageCircle, Share2 } from "lucide-react"

type PostCardProps = {
  id: string
  content: string
  image_url?: string
  user: {
    name: string
    username: string
    avatar_url?: string
  }
  likes: number
  comments: number
}

export default function PostCard({
  id,
  content,
  image_url,
  user,
  likes,
  comments,
}: PostCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={
            user.avatar_url ||
            `https://ui-avatars.com/api/?name=${user.name}`
          }
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-gray-400">@{user.username}</p>
        </div>
      </div>

      {/* Gambar */}
      {image_url && (
        <img
          src={image_url}
          alt="post"
          className="w-full aspect-square object-cover"
        />
      )}

      {/* Konten */}
      <div className="p-4">
        <p className="text-sm text-gray-800 line-clamp-3">{content}</p>
      </div>

      {/* Footer: Actions */}
      <div className="px-4 pb-4 flex items-center gap-4 text-gray-500 border-t">
        <button className="flex items-center gap-1 hover:text-red-500 transition py-2 flex-1 justify-center">
          <Heart size={20} />
          <span className="text-sm font-semibold">{likes}</span>
        </button>

        <Link
          to={`/post/${id}`}
          className="flex items-center gap-1 hover:text-blue-500 transition py-2 flex-1 justify-center"
        >
          <MessageCircle size={20} />
          <span className="text-sm font-semibold">{comments}</span>
        </Link>

        <button className="flex items-center gap-1 hover:text-green-500 transition py-2 flex-1 justify-center">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  )
}
```


### File: `apps/frontend/src/components/CommentItem.tsx`
```tsx
import { Heart } from "lucide-react"
import { useState } from "react"

type CommentItemProps = {
  id: string
  author: {
    id: string
    name: string
    username?: string
    avatar_url?: string
  }
  content: string
  createdAt: string
  parentId?: string | null
  onReply?: (commentId: string, username: string) => void
}

export default function CommentItem({
  id,
  author,
  content,
  createdAt,
  parentId,
  onReply,
}: CommentItemProps) {
  const [liked, setLiked] = useState(false)

  const displayName = author.username || author.name

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Baru saja"
    if (diffMins < 60) return `${diffMins} mnt`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} j`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} h`
    return date.toLocaleDateString("id-ID")
  }

  return (
    <div
      className={`flex gap-3 py-2 ${
        parentId ? "ml-10" : ""
      }`}
    >
      <img
        src={
          author.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            author.name
          )}&size=64&background=random`
        }
        alt={author.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
      />

      <div className="flex-1">
        <p className="text-sm text-[#262626] leading-[18px]">
          <span className="font-semibold">{displayName}</span>{" "}
          {content}
        </p>

        <div className="flex items-center gap-3 mt-[6px]">
          <span className="text-xs text-[#8e8e8e]">
            {formatDate(createdAt)}
          </span>

          <button
            onClick={() => onReply?.(id, displayName)}
            className="text-xs text-[#8e8e8e] font-semibold hover:text-[#262626]"
          >
            Balas
          </button>
        </div>
      </div>

      <button
        onClick={() => setLiked(!liked)}
        className="pt-1"
      >
        <Heart
          size={11}
          className={
            liked
              ? "fill-red-500 text-red-500"
              : "text-[#8e8e8e]"
          }
        />
      </button>
    </div>
  )
}
```


### File: `apps/frontend/src/components/NotificationItem.tsx`
```tsx
import type { Notification } from "../stores/notification.store"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "baru saja"
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  const weeks = Math.floor(days / 7)
  return `${weeks} minggu lalu`
}

type Props = {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

export default function NotificationItem({ notification, onMarkAsRead }: Props) {
  const { actor, type, post, is_read, created_at, id } = notification

  const initials = actor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const message =
    type === "like"
      ? "menyukai postingan kamu."
      : "mengomentari postingan kamu."

  return (
    <div
      onClick={() => onMarkAsRead(id)}
      className={`flex items-center gap-3 px-2 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition ${
        !is_read ? "bg-blue-50" : ""
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
        {actor.avatar_url ? (
          <img
            src={actor.avatar_url}
            alt={actor.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Teks */}
      <div className="flex-1 text-sm">
        <span className="font-semibold">{actor.username}</span>{" "}
        <span className="text-gray-700">{message}</span>
        {post && (
          <span className="text-gray-400"> "{post.content.slice(0, 30)}..."</span>
        )}
        <div className="text-xs text-gray-400 mt-0.5">{timeAgo(created_at)}</div>
      </div>

      {/* Indikator belum dibaca */}
      {!is_read && (
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
      )}
    </div>
  )
}
```


### File: `apps/frontend/src/components/NotificationPanel.tsx`
```tsx
import { useState } from "react"
import { X } from "lucide-react"
import NotificationItem from "./NotificationItem"
import type { Notification } from "../stores/notification.store"

const dummyNotifications: Notification[] = [
  {
    id: "1",
    user_id: "99",
    actor_id: "1",
    type: "like",
    post_id: "10",
    comment_id: null,
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    actor: { id: "1", name: "Budi Santoso", username: "budi_s", avatar_url: null },
    post: { id: "10", content: "Sunset di pantai Bali", image_url: null },
  },
  {
    id: "2",
    user_id: "99",
    actor_id: "2",
    type: "comment",
    post_id: "10",
    comment_id: "5",
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actor: { id: "2", name: "Siti Rahayu", username: "siti_r", avatar_url: null },
    post: { id: "10", content: "Sunset di pantai Bali", image_url: null },
  },
  {
    id: "3",
    user_id: "99",
    actor_id: "3",
    type: "like",
    post_id: "11",
    comment_id: null,
    is_read: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { id: "3", name: "Andi Wijaya", username: "andi_w", avatar_url: null },
    post: { id: "11", content: "Makan siang enak hari ini", image_url: null },
  },
  {
    id: "4",
    user_id: "99",
    actor_id: "4",
    type: "comment",
    post_id: "11",
    comment_id: "6",
    is_read: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { id: "4", name: "Dewi Lestari", username: "dewi_l", avatar_url: null },
    post: { id: "11", content: "Makan siang enak hari ini", image_url: null },
  },
]

function getGroup(createdAt: string): "Hari ini" | "Minggu ini" | "Lebih Awal" {
  const diff = Date.now() - new Date(createdAt).getTime()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 1) return "Hari ini"
  if (days < 7) return "Minggu ini"
  return "Lebih Awal"
}

type Props = {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications)

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const groups: ("Hari ini" | "Minggu ini" | "Lebih Awal")[] = [
    "Hari ini",
    "Minggu ini",
    "Lebih Awal",
  ]

  return (
    <div className="fixed top-0 left-20 h-screen w-96  bg-white border-r shadow-xl z-30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <h2 className="text-xl font-bold">Notifikasi</h2>
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* List notifikasi */}
      <div className="overflow-y-auto flex-1 px-4 py-4">
        {groups.map((group) => {
          const items = notifications.filter(
            (n) => getGroup(n.created_at) === group
          )
          if (items.length === 0) return null
          return (
            <div key={group} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">{group}</h3>
              <div className="flex flex-col gap-1">
                {items.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```


### File: `apps/frontend/src/App.tsx`
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import ProtectedRoute from "./components/ProtectedRoute"

const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">🚧</h1>
      <p className="text-gray-500">
        Halaman {name} sedang disiapkan oleh tim lain
      </p>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="Detail Post" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="Notifikasi" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
```


### File: `apps/frontend/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>frontend</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```
