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