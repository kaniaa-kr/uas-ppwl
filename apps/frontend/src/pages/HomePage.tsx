import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import PostCard from "../components/PostCard"

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBeranda = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts")
        if (!response.ok) throw new Error("Gagal mengambil data beranda dari server")

        const result = await response.json()

        // Proteksi ekstra: Pastikan result sukses dan result.data adalah array yang valid
        if (result && result.success && Array.isArray(result.data)) {
          setPosts(result.data)
        } else {
          // Jika backend mengirim success: false atau error object, tangkap di sini
          setError(result.message || "Gagal memuat kiriman dari server")
          setPosts([]) // Amankan state dengan array kosong agar tidak crash
        }
      } catch (err) {
        setError("Koneksi gagal. Pastikan server backend Anda sudah dinyalakan di port 3000")
        setPosts([]) // Amankan state
      } finally {
        setLoading(false)
      }
    }

    fetchBeranda()
  }, [])

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Navigasi Atas */}
      <Navbar />

      {/* Kontainer Utama (Mobile-First Approach) */}
      <main className="max-w-lg mx-auto pt-6 px-4 sm:px-0 pb-24">

        {/* 1. Loading State */}
        {loading && (
          <p className="text-center text-sm text-gray-500 mt-12 animate-pulse">
            Memuat beranda...
          </p>
        )}

        {/* 2. Error Handling State */}
        {error && (
          <div className="text-center mt-12 p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* 3. Empty State (Jika array database merespons [] kosong atau setelah fallback) */}
        {!loading && posts.length === 0 && (
          <div className="text-center mt-12 p-8 border border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">
              Belum ada postingan di beranda. Database kosong atau belum di-seed.
            </p>
          </div>
        )}

        {/* 4. Render Feed Utama (Menggunakan safe guard &&) */}
        {!loading && posts && posts.length > 0 && (
          <div className="w-full flex flex-col">
            {posts.map((post: any) => (
              // Pastikan data post memiliki ID yang unik, atau fallback ke index jika terpaksa
              <PostCard key={post?.id} post={post} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}