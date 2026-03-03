import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from '../features/app/dashboard/pages/DashboardPage.tsx'
import ProtectedRoute from '../common/components/ui/ProtectedRoute.tsx'
import AuthPage from '../features/landing/auth/pages/AuthPage.tsx'
import WalletPage from '../features/app/wallets/pages/WalletPage.tsx'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/auth" element={<AuthPage />} />
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
        </Routes>
    )
}

export default App
