import { LayoutDashboard, Tag, WalletIcon } from 'lucide-react'
import { useUIContext } from '../../../context/UIContext.tsx'
import { useNavigate } from 'react-router-dom'
import { useBackdrop } from '../../../context/BackdropContext.tsx'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: WalletIcon, label: 'Wallets', path: '/wallets' },
    { icon: Tag, label: 'Categories', path: '/' },
]

export default function NavMenu() {
    const { activePage } = useUIContext()
    const navigate = useNavigate()
    const { clearAll } = useBackdrop()
    return (
        <nav className="flex flex-1 flex-row justify-center gap-4">
            {navItems.map(({ icon: Icon, label, path }) => {
                const isActive = activePage === path
                return (
                    <button
                        key={label}
                        onClick={() => {
                            clearAll()
                            navigate(path)
                        }}
                        className={`flex cursor-pointer items-center gap-2.5 px-3 py-2.5 text-sm font-semibold transition-all ${
                            isActive
                                ? 'border-accent text-accent border-b-3'
                                : 'text-text-muted hover:text-accent-hover'
                        }`}
                    >
                        <Icon size={16} />
                        {label}
                    </button>
                )
            })}
        </nav>
    )
}
