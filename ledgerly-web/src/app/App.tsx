import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from '../features/app/dashboard/pages/DashboardPage.tsx'
import ProtectedRoute from '../common/components/ui/ProtectedRoute.tsx'
import AuthPage from '../features/landing/auth/pages/AuthPage.tsx'
import WalletPage from '../features/app/wallets/pages/WalletPage.tsx'
import { useAuth } from '../common/context/AuthenticationContext.tsx'
import Spinner from '../common/components/ui/Spinner.tsx'

function App() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <Spinner />
    }

    return (
        <Routes>
            <Route
                path="/auth"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />}
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/wallets"
                element={
                    <ProtectedRoute>
                        <WalletPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? '/dashboard' : '/auth'} replace />}
            />
        </Routes>
    )
}

export default App
