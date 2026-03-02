import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from '../pages/app/DashboardPage.tsx'
import ProtectedRoute from '../components/common/ProtectedRoute.tsx'
import AuthPage from '../pages/app/Auth/AuthPage.tsx'
import WalletPage from '../pages/app/WalletPage.tsx'

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
