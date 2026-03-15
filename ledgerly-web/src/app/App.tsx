import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuthInit } from '../domains/auth/hooks/useAuthInit.ts'
import AuthPage from '../pages/AuthPage.tsx'
import DashboardPage from '../pages/DashboardPage.tsx'
import TransactionsPage from '../pages/TransactionsPage.tsx'
import { useThemeStore } from '../shared/stores/themeStore.ts'
import ProtectedRoute from '../shared/ui/ProtectedRoute.tsx'

function App() {
    const theme = useThemeStore((state) => state.theme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    useAuthInit()

    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <TransactionsPage />
                    </ProtectedRoute>
                }
            />

            <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
    )
}

export default App
