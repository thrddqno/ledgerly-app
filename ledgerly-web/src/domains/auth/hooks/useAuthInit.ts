import { useEffect } from 'react'

import { useAuthStore } from '../store/authStore.ts'

export function useAuthInit() {
    const checkAuth = useAuthStore((state) => state.checkAuth)
    const logout = useAuthStore((state) => state.logout)

    useEffect(() => {
        checkAuth().catch((error) => {
            console.error('Check Auth Error: ', error)
        })
    }, [checkAuth])

    useEffect(() => {
        const handleUnauthorized = async () => {
            await logout()
        }
        window.addEventListener('auth:unauthorized', handleUnauthorized)
        return () =>
            window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }, [logout])
}
