import { create } from 'zustand'

type AuthUser = { username: string; role: 'admin' | 'user' } 

interface AuthState {
    user: AuthUser | null
    isAuthenticated: boolean
    setUser: (user: AuthUser | null) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({

    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user: user, isAuthenticated: true}),
    logout: () => set({user: null, isAuthenticated: false})
}))