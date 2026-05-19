import { Heart, MessageCircle } from "lucide-react"

export default function PostCard({ post }: { post: any }) {
  // Fallback data jika nama atau avatar kosong di database
  const username = post.user?.username || post.user?.name || "user_instagram"
  const avatar = post.user?.avatar_url || "https://github.com/shadcn.png"

  return (
    <article className="border border-[#DBDBDB] bg-[#FFFFFF] rounded-md mb-6 w-full shadow-none">

      {/* HEADER PROFILE */}
      <div className="flex items-center p-4">
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className="w-8 h-8 rounded-full mr-3 border border-gray-200 object-cover"
        />
        <span className="font-semibold text-sm text-[#262626]">{username}</span>
      </div>

      {/* KONTEN VISUAL (Content First) */}
      <div className="bg-gray-50 w-full aspect-square flex items-center justify-center border-y border-gray-100 text-gray-400">
        {post.image_url ? (
          <img src={post.image_url} alt="Post content" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs">Tidak ada media gambar</span>
        )}
      </div>

      {/* AREA AKSI & INFORMASI POSTINGAN */}
      <div className="p-4">
        {/* Tombol Interaksi Utama */}
        <div className="flex space-x-4 mb-3">
          <button className="text-[#262626] hover:text-gray-400 transition-colors cursor-pointer">
            <Heart size={24} />
          </button>
          <button className="text-[#262626] hover:text-gray-400 transition-colors cursor-pointer">
            <MessageCircle size={24} />
          </button>
        </div>

        {/* Total Likes */}
        <div className="text-sm font-semibold text-[#262626] mb-2">
          {post._count?.likes || 0} Likes
        </div>

        {/* Caption Postingan */}
        <div className="text-sm text-[#262626] leading-relaxed">
          <span className="font-semibold mr-2">{username}</span>
          {post.content || ""}
        </div>

        {/* Pemicu List Komentar */}
        <div className="text-xs text-gray-500 mt-2 cursor-pointer hover:underline">
          Lihat semua {post._count?.comments || 0} komentar
        </div>
      </div>

    </article>
  )
}