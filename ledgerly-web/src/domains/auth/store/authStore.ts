import { create } from 'zustand'

import {
    checkAuth as checkAuthRequest,
    fetchUser as fetchUserRequest,
    loginRequest,
    logoutRequest,
    registerRequest,
} from '../api/auth.ts'
import type { User } from '../types/user.ts'

type AuthStore = {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error?: Error | null

    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => Promise<void>
    checkAuth: () => Promise<void>
    fetchUser: () => Promise<void>

    clearError: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    fetchUser: async () => {
        const store = useAuthStore.getState()
        if (store.user) {
            return
        }
        try {
            set({ isLoading: true, error: null })
            const userData = await fetchUserRequest()
            set({ user: userData, isLoading: false })
        } catch (e) {
            set({ error: e as Error, isLoading: false })
        }
    },

    checkAuth: async () => {
        try {
            set({ isLoading: true, error: null })
            await checkAuthRequest()
            set({ isAuthenticated: true, isLoading: false })
        } catch (e) {
            set({ isAuthenticated: false, error: e as Error, isLoading: false })
        }
    },

    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true, error: null })
            await loginRequest({ email, password })
            set({ isAuthenticated: true })

            //cache user
            await useAuthStore.getState().fetchUser()
            set({ isLoading: false })
        } catch (e) {
            set({ isAuthenticated: false, error: e as Error, isLoading: false })
        }
    },
    logout: async () => {
        try {
            await logoutRequest()
        } catch (e) {
            console.error('Logout error:', e)
        } finally {
            set({
                isAuthenticated: false,
                user: null,
                error: null,
                isLoading: false,
            })
        }
    },
    register: async (firstName, lastName, email, password) => {
        try {
            set({ isLoading: true, error: null })
            await registerRequest({ firstName, lastName, email, password })
            set({ isAuthenticated: true, isLoading: false })

            await useAuthStore.getState().fetchUser()
            set({ isLoading: false })
        } catch (e) {
            set({ isAuthenticated: false, error: e as Error, isLoading: false })
        }
    },

    clearError: () => {
        set({ error: null })
    },
}))
