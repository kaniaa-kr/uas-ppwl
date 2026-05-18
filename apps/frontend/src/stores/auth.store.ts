import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AuthUser = {
  id: string
  name: string
  username: string
  email: string
  avatar_url?: string
}

type AuthStore = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // Nama key di localStorage
    }
  )
)