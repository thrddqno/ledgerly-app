import { LayoutDashboard, LogOut, Moon, Sun, Tag, User, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme.ts'
import { useAuth } from '../../context/AuthenticationContext.tsx'
import { useUIContext } from '../../context/UIContext.tsx'
import { useModal } from '../../context/ModalContext.tsx'

const navItems = [
    { icon: LayoutDashboard, label: 'Your Ledger', path: '/dashboard' },
    { icon: Wallet, label: 'Wallets', path: '/wallets' },
    { icon: Tag, label: 'Categories', path: '/' },
]

export default function SideBar() {
    const navigate = useNavigate()
    const { activePage } = useUIContext()
    const { openModal } = useModal()
    const { theme, toggleTheme } = useTheme()
    const { user } = useAuth()

    return (
        <aside className="bg-surface border-border flex w-65 shrink-0 flex-col border-r px-4 py-6">
            <div className="mb-9 flex flex-col items-center justify-center gap-1 p-2">
                <span className="text-accent text-4xl font-extrabold">Ledgerly</span>
                <span className="text-text-primary text-xs font-extrabold">
                    Personal Finance Tracker
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-2">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = activePage === path
                    return (
                        <button
                            key={label}
                            onClick={() => navigate(path)}
                            className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all ${
                                isActive
                                    ? 'bg-accent/10 text-accent font-semibold'
                                    : 'text-text-primary hover:text-text-primary hover:bg-elevated font-normal'
                            }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    )
                })}
            </nav>

            <div className="border-border flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2.5">
                    <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-text-primary text-[13px] font-semibold hover:cursor-default">
                            {user?.firstName}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <button
                        onClick={toggleTheme}
                        className="text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                    </button>
                    <button
                        onClick={() => openModal({ type: 'logout' })}
                        className="text-text-muted hover:text-expense cursor-pointer transition-colors"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    )
}
