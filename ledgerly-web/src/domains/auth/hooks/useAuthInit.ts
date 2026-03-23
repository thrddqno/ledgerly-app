import { useEffect } from 'react'

import { useAuthStore } from '../store/authStore.ts'

export function useAuthInit() {
    const checkAuth = useAuthStore((state) => state.checkAuth)
    const logout = useAuthStore((state) => state.logout)
    const fetchUser = useAuthStore((state) => state.fetchUser)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        const init = async () => {
            try {
                await checkAuth()
            } catch (error) {
                console.error('Auth init error:', error)
            }
        }
        init()
    }, [checkAuth])

    useEffect(() => {
        const init = async () => {
            if (isAuthenticated)
                try {
                    await fetchUser()
                } catch (error) {
                    console.error('Auth init error:', error)
                }
        }
        init()
    }, [fetchUser, isAuthenticated])

    useEffect(() => {
        const handleUnauthorized = async () => {
            await logout()
        }
        window.addEventListener('auth:unauthorized', handleUnauthorized)
        return () =>
            window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }, [logout])
}
