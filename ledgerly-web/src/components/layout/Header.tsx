import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthenticationContext'

export default function Header() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    async function handleLogout() {
        try {
            await logout()
            navigate('/auth')
        } catch (e) {
            console.error('Logout failed', e)
        }
    }

    return (
        <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
            <span className="text-lg font-bold text-gray-900">Hello, {user?.firstName}!</span>
            <button
                onClick={handleLogout}
                type="button"
                className="cursor-pointer text-sm text-gray-500 transition-colors hover:text-red-500"
            >
                Logout
            </button>
        </header>
    )
}
