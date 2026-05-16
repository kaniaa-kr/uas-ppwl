export type User = {
  id: string
  name: string
  username: string
  email: string
  avatar_url?: string
  bio?: string
  provider: "email" | "google"
}

export type Post = {
  id: string
  user_id: string
  content: string
  image_url?: string
  created_at: string
  user: Pick<User, "id" | "name" | "username" | "avatar_url">
  _count: {
    likes: number
    comments: number
  }
}

export type Comment = {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  user: Pick<User, "id" | "name" | "avatar_url">
}

export type Notification = {
  id: string
  user_id: string
  actor_id: string
  type: "like" | "comment"
  post_id?: string
  comment_id?: string
  is_read: boolean
  created_at: string
  actor: Pick<User, "id" | "name" | "avatar_url">
  post?: Pick<Post, "id" | "content">
}