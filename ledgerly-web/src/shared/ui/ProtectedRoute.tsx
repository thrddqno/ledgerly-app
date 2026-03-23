import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthStore } from '../../domains/auth/store/authStore.ts'
import Spinner from './Spinner.tsx'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const isLoading = useAuthStore((state) => state.isLoading)

    if (isLoading) return <Spinner />

    if (!isAuthenticated) return <Navigate to={'/auth'} replace />

    return <>{children}</>
}
