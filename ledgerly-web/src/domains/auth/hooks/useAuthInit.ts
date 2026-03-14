import { useEffect } from 'react'

import { useAuthStore } from '../store/authStore.ts'

export function useAuthInit() {
    const checkAuth = useAuthStore((state) => state.checkAuth)
    const logout = useAuthStore((state) => state.logout)
    const fetchUser = useAuthStore((state) => state.fetchUser)

    useEffect(() => {
        const init = async () => {
            try {
                await checkAuth()
                await fetchUser()
            } catch (error) {
                console.error('Auth init error:', error)
            }
        }
        init()
    }, [checkAuth, fetchUser])

    useEffect(() => {
        const handleUnauthorized = async () => {
            await logout()
        }
        window.addEventListener('auth:unauthorized', handleUnauthorized)
        return () =>
            window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }, [logout])
}
