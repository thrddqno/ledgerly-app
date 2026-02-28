import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthenticationContext'

export default function Header() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    async function handleLogout() {
        try {
            await logout()
            navigate('/')
        } catch (e) {
            console.error('Logout failed', e)
        }
    }

    return (
        <header className="w-full px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Ledgerly</span>
            <button
                onClick={handleLogout}
                type="button"
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
                Logout
            </button>
        </header>
    )
}