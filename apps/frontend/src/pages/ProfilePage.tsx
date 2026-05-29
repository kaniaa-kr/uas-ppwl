import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import Navbar from "../components/Navbar"
import { toast } from "sonner"
import { Camera, Eye, EyeOff, Check, X, Upload } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

type Tab = "posts" | "edit" | "password"

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>("posts")

  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    bio: "",
    avatar_url: user?.avatar_url ?? "",
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url ?? "")
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", confirm: "" })
  const [pwLoading, setPwLoading] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const [posts, setPosts] = useState<any[]>([])
  const [postsLoading, setPostsLoading] = useState(false)

  useEffect(() => {
    if (!user?.username || activeTab !== "posts") return
    setPostsLoading(true)
    fetch(`${API_URL}/posts?username=${user.username}`)
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : data.posts ?? []))
      .catch(() => {})
      .finally(() => setPostsLoading(false))
  }, [user?.username, activeTab])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((p) => ({ ...p, [name]: value }))
    if (name === "avatar_url") setAvatarPreview(value)
  }

  const handleAvatarFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran maksimal 10MB")
      return
    }
    setAvatarUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      )
      if (!res.ok) throw new Error()
      const data = await res.json()
      setAvatarPreview(data.secure_url)
      setProfileForm((p) => ({ ...p, avatar_url: data.secure_url }))
      toast.success("Foto profil berhasil diupload!")
    } catch {
      toast.error("Gagal upload foto, coba lagi")
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleAvatarFileUpload(file)
  }

  const handleSaveProfile = async () => {
    if (!token) return
    setProfileLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileForm.name || undefined,
          email: profileForm.email || undefined,
          bio: profileForm.bio || null,
          avatar_url: profileForm.avatar_url || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Gagal memperbarui profil")
      }
      const updated = await res.json()
      setAuth(
        {
          id: updated.id,
          name: updated.name,
          username: updated.username,
          email: updated.email,
          avatar_url: updated.avatar_url,
        },
        token
      )
      toast.success("Profil berhasil diperbarui!")
    } catch (e: any) {
      toast.error(e.message || "Gagal memperbarui profil")
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!pwForm.old_password || !pwForm.new_password) {
      toast.error("Semua field wajib diisi")
      return
    }
    if (pwForm.new_password !== pwForm.confirm) {
      toast.error("Konfirmasi password tidak cocok")
      return
    }
    if (pwForm.new_password.length < 6) {
      toast.error("Password baru minimal 6 karakter")
      return
    }
    setPwLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: pwForm.old_password,
          new_password: pwForm.new_password,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Gagal mengubah password")
      }
      toast.success("Password berhasil diubah!")
      setPwForm({ old_password: "", new_password: "", confirm: "" })
    } catch (e: any) {
      toast.error(e.message || "Gagal mengubah password")
    } finally {
      setPwLoading(false)
    }
  }

  const inputClass =
    "w-full bg-[#1a1a1a] border border-[#363636] rounded-lg px-3 py-[10px] text-[14px] text-white placeholder-[#6b6b6b] outline-none focus:border-[#737373] transition-colors"

  const tabList: { key: Tab; label: string }[] = [
    { key: "posts", label: "Postingan" },
    { key: "edit", label: "Edit Profil" },
    { key: "password", label: "Ubah Password" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="md:ml-[72px] lg:ml-[244px] pt-[48px] md:pt-0 pb-[48px] md:pb-0">
        <div className="max-w-[935px] mx-auto px-4 py-6 md:py-10">

          {/* ── Profile Header ── */}
          <div className="flex items-center gap-6 md:gap-10 mb-8 md:mb-10">
            <div className="relative flex-shrink-0">
              <div className="w-[77px] h-[77px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden bg-[#262626]">
                {avatarUploading ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                    <div className="w-6 h-6 rounded-full border-2 border-[#363636] border-t-[#0095f6] animate-spin" />
                  </div>
                ) : (
                  <img
                    src={
                      avatarPreview ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "U")}&size=150&background=262626&color=ffffff`
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarPreview("")}
                  />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute bottom-1 right-1 bg-[#363636] rounded-full p-1.5 text-white shadow hover:bg-[#4a4a4a] transition-colors disabled:opacity-50"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div>
              <h1 className="text-[20px] md:text-[28px] font-light text-white mb-1">
                {user?.username}
              </h1>
              <p className="text-[14px] text-[#737373]">{user?.name}</p>
              <p className="text-[14px] text-[#737373]">{user?.email}</p>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="border-t border-[#363636] mb-6">
            <div className="flex gap-0">
              {tabList.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-3 text-[12px] font-semibold uppercase tracking-wider border-t-[1px] -mt-px transition-colors ${
                    activeTab === key
                      ? "border-white text-white"
                      : "border-transparent text-[#737373] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Posts Tab ── */}
          {activeTab === "posts" && (
            <div>
              {postsLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 rounded-full border-2 border-[#363636] border-t-[#737373] animate-spin" />
                </div>
              ) : posts.length === 0 ? (
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
          )}

          {/* ── Edit Profil Tab ── */}
          {activeTab === "edit" && (
            <div className="max-w-[500px]">
              <div className="flex flex-col gap-4">
                {/* Avatar */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-2">
                    Foto Profil
                  </label>
                  <input
                    name="avatar_url"
                    type="url"
                    placeholder="https://example.com/foto.jpg"
                    value={profileForm.avatar_url}
                    onChange={handleProfileChange}
                    className={inputClass}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="mt-2 flex items-center gap-2 text-[13px] text-[#0095f6] hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Upload size={14} />
                    <span>{avatarUploading ? "Mengupload..." : "Upload dari perangkat"}</span>
                  </button>
                  {avatarPreview && !avatarUploading && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={avatarPreview}
                        alt="preview"
                        className="w-10 h-10 rounded-full object-cover border border-[#363636]"
                        onError={() => { setAvatarPreview(""); toast.error("URL tidak valid") }}
                      />
                      <span className="text-[12px] text-[#737373]">Preview avatar</span>
                      <button
                        onClick={() => {
                          setAvatarPreview("")
                          setProfileForm((p) => ({ ...p, avatar_url: "" }))
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                      >
                        <X size={14} className="text-[#737373] hover:text-white" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Nama */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Nama lengkap"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className={inputClass}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    maxLength={150}
                    rows={3}
                    className="w-full bg-[#1a1a1a] border border-[#363636] rounded-lg px-3 py-[10px] text-[14px] text-white placeholder-[#6b6b6b] outline-none focus:border-[#737373] transition-colors resize-none"
                  />
                  <div className="text-right text-[12px] text-[#4a4a4a]">
                    {profileForm.bio.length}/150
                  </div>
                </div>

                {/* Username read-only */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-2">
                    Nama Pengguna
                  </label>
                  <input
                    type="text"
                    value={user?.username ?? ""}
                    readOnly
                    className="w-full bg-[#0d0d0d] border border-[#363636] rounded-lg px-3 py-[10px] text-[14px] text-[#737373] cursor-not-allowed"
                  />
                  <p className="text-[12px] text-[#4a4a4a] mt-1">Username tidak dapat diubah</p>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={profileLoading}
                  className="mt-2 bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold py-[10px] px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start flex items-center gap-2"
                >
                  {profileLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  {profileLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          )}

          {/* ── Ubah Password Tab ── */}
          {activeTab === "password" && (
            <div className="max-w-[500px]">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-2">
                    Password Lama
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      placeholder="Password saat ini"
                      value={pwForm.old_password}
                      onChange={(e) => setPwForm((p) => ({ ...p, old_password: e.target.value }))}
                      className={inputClass + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                    >
                      {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-white mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={pwForm.new_password}
                      onChange={(e) => setPwForm((p) => ({ ...p, new_password: e.target.value }))}
                      className={inputClass + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-white mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Ulangi password baru"
                      value={pwForm.confirm}
                      onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                      className={inputClass}
                    />
                    {pwForm.confirm && (
                      <span
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          pwForm.confirm === pwForm.new_password ? "text-green-500" : "text-[#ff3040]"
                        }`}
                      >
                        {pwForm.confirm === pwForm.new_password ? <Check size={18} /> : <X size={18} />}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading || !pwForm.old_password || !pwForm.new_password}
                  className="mt-2 bg-[#0095f6] hover:bg-[#1877f2] text-white text-[14px] font-semibold py-[10px] px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start flex items-center gap-2"
                >
                  {pwLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  {pwLoading ? "Menyimpan..." : "Ubah Password"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
