import { create } from 'zustand'

type AuthUser = { username: string; role: 'admin' | 'user' } 

interface AuthState {
    user: AuthUser | null
    isAuthenticated: boolean
    isLoading: boolean
    setUser: (user: AuthUser | null) => void
    logout: () => void
    setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({

    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => set({ user: null, isAuthenticated: false }),
    setLoading: (loading) => set({ isLoading: loading }),
}))