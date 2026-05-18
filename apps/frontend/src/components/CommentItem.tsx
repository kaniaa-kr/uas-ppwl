import { Trash2 } from "lucide-react"

type CommentItemProps = {
  id: string
  author: {
    name: string
    avatar_url?: string
  }
  content: string
  createdAt: string
  onDelete?: (id: string) => void
  canDelete?: boolean
}

export default function CommentItem({
  id,
  author,
  content,
  createdAt,
  onDelete,
  canDelete = false,
}: CommentItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Baru saja"
    if (diffMins < 60) return `${diffMins} menit lalu`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} jam lalu`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} hari lalu`

    return date.toLocaleDateString("id-ID")
  }

  return (
    <div className="flex gap-3 bg-white rounded-lg p-3 border hover:bg-gray-50 transition">
      {/* Avatar */}
      <img
        src={
          author.avatar_url ||
          `https://ui-avatars.com/api/?name=${author.name}`
        }
        alt={author.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-xs">{author.name}</p>
        <p className="text-sm text-gray-700 break-words">{content}</p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(createdAt)}
        </p>
      </div>

      {/* Delete button */}
      {canDelete && onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="text-red-400 hover:text-red-600 transition flex-shrink-0"
          title="Hapus komentar"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}