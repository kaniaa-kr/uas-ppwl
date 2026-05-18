import { create } from "zustand"

export type Notification = {
  id: string
  user_id: string
  actor_id: string
  type: "like" | "comment"
  post_id: string | null
  comment_id: string | null
  is_read: boolean
  created_at: string
  actor: {
    id: string
    name: string
    username: string
    avatar_url: string | null
  }
  post: {
    id: string
    content: string
    image_url: string | null
  } | null
}

type NotificationStore = {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  markAsRead: (id: string) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: state.notifications.filter(
        (n) => !n.is_read && n.id !== id
      ).length,
    })),
}))