import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: (localStorage.getItem('theme') as Theme) || 'light',
    toggleTheme: () =>
        set((state) => {
            const next = state.theme === 'light' ? 'dark' : 'light'
            document.documentElement.setAttribute('data-theme', next)
            return { theme: next }
        }),
    setTheme: (theme) => {
        localStorage.setItem('theme', theme)
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
    },
}))
