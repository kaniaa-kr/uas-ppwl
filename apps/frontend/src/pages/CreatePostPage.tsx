import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import Navbar from "../components/Navbar"
import { toast } from "sonner"
import { ImageIcon, X, ArrowLeft, Upload } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export default function CreatePostPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState<"none" | "url" | "file">("none")

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 10MB")
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      )
      if (!res.ok) throw new Error("Upload gagal")
      const data = await res.json()
      setImageUrl(data.secure_url)
      setPreview(data.secure_url)
      toast.success("Gambar berhasil diupload!")
    } catch {
      toast.error("Gagal upload gambar, coba lagi")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleImageUrlChange = (val: string) => {
    setImageUrl(val)
    setPreview(val)
  }

  const handleClearImage = () => {
    setPreview("")
    setImageUrl("")
    setInputMode("none")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Caption tidak boleh kosong")
      return
    }
    if (!imageUrl.trim()) {
      toast.error("Gambar wajib disertakan")
      return
    }
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          image_url: imageUrl.trim(),
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        let err: any = { error: "Gagal membuat postingan" }
        try { err = JSON.parse(text) } catch { err = { error: text || "Gagal membuat postingan" } }
        throw new Error(err.error || err.message || err.detail || "Gagal membuat postingan")
      }
      toast.success("Postingan berhasil dibagikan!")
      navigate("/")
    } catch (e: any) {
      toast.error(e.message || "Gagal membuat postingan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0">

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-[60] bg-black border-b border-[#262626] h-[48px] flex items-center justify-between px-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <span className="text-[16px] font-semibold text-white">Postingan Baru</span>
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim() || !imageUrl.trim()}
            className="text-[#0095f6] font-semibold text-[14px] disabled:opacity-40"
          >
            {loading ? "..." : "Bagikan"}
          </button>
        </div>

        <div className="max-w-[600px] mx-auto px-4 py-6 md:py-10">
          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-[24px] font-bold text-white">Buat Postingan</h1>
          </div>

          <div className="bg-[#1a1a1a] border border-[#262626] rounded-sm overflow-hidden">
            {/* User info */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-[#262626]">
              <img
                src={
                  user?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&size=64&background=262626&color=ffffff`
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-[14px] font-semibold text-white">{user?.username}</span>
            </div>

            {/* Image preview */}
            {preview && (
              <div className="relative w-full aspect-square bg-[#0a0a0a]">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setPreview("")
                    toast.error("URL gambar tidak valid")
                  }}
                />
                <button
                  onClick={handleClearImage}
                  className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-1.5 hover:bg-black transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Upload loading state */}
            {uploading && (
              <div className="w-full aspect-square bg-[#0d0d0d] flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#363636] border-t-[#0095f6] animate-spin" />
                <span className="text-[13px] text-[#737373]">Mengupload gambar...</span>
              </div>
            )}

            {/* Caption */}
            <div className="px-4 pt-4 pb-2">
              <textarea
                placeholder="Tulis caption..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2200}
                rows={4}
                className="w-full text-[14px] text-white placeholder-[#6b6b6b] outline-none resize-none bg-transparent leading-snug"
              />
              <div className="flex justify-end">
                <span className="text-[12px] text-[#4a4a4a]">{content.length}/2200</span>
              </div>
            </div>

            {/* Image input options */}
            {!preview && !uploading && (
              <div className="border-t border-[#262626] px-4 py-3 flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {inputMode === "none" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-[14px] text-[#737373] hover:text-white transition-colors"
                    >
                      <Upload size={20} strokeWidth={1.5} />
                      <span>Upload dari perangkat</span>
                    </button>
                    <span className="text-[#363636]">|</span>
                    <button
                      onClick={() => setInputMode("url")}
                      className="flex items-center gap-2 text-[14px] text-[#737373] hover:text-white transition-colors"
                    >
                      <ImageIcon size={20} strokeWidth={1.5} />
                      <span>Pakai URL</span>
                    </button>
                  </div>
                )}

                {inputMode === "url" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Masukkan URL gambar..."
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="flex-1 text-[13px] text-white placeholder-[#6b6b6b] outline-none bg-[#121212] border border-[#363636] rounded-lg px-3 py-2"
                      autoFocus
                    />
                    <button
                      onClick={() => { setInputMode("none"); setImageUrl(""); setPreview("") }}
                      className="text-[#737373] hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-[#ff3040]">* Gambar wajib disertakan</p>
              </div>
            )}

            {/* Submit button desktop */}
            <div className="hidden md:block border-t border-[#262626] px-4 py-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim() || !imageUrl.trim()}
                className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold py-[10px] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Memposting..." : "Bagikan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
