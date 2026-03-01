import {
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Moon,
    Plus,
    Sun,
    Tag,
    User,
    Wallet,
    WalletCards,
    WalletIcon,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthenticationContext.tsx'
import { useState } from 'react'
import { useWallets } from '../../hooks/useWallets.ts'
import { AddWalletModal } from '../modals/AddWalletModal.tsx'
import { useTheme } from '../../hooks/useTheme.ts'

const navItems = [
    { icon: LayoutDashboard, label: 'Your Ledger', path: '/dashboard' },
    { icon: Wallet, label: 'Wallets', path: '/' },
    { icon: Tag, label: 'Categories', path: '/' },
]

export default function SideBar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const { wallets, createWallet } = useWallets()
    const [walletsOpen, setWalletsOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { theme, toggleTheme } = useTheme()

    async function handleLogout() {
        await logout()
        navigate('/auth')
    }

    return (
        <aside className="bg-surface border-border flex w-65 shrink-0 flex-col border-r px-4 py-6">
            <div className="mb-9 flex justify-center p-2">
                <span className="text-accent text-3xl font-extrabold">Ledgerly</span>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
                {navItems.map(({ icon: Icon, label, path }) => {
                    if (label === 'Wallets') {
                        return (
                            <div key={label}>
                                <button
                                    onClick={() => setWalletsOpen((p) => !p)}
                                    className="text-text-primary hover:text-text-primary hover:bg-elevated flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <WalletCards size={16} />
                                        Wallets
                                    </div>
                                    {walletsOpen ? (
                                        <ChevronDown size={14} />
                                    ) : (
                                        <ChevronRight size={14} />
                                    )}
                                </button>

                                {walletsOpen && (
                                    <div className="border-text-muted mt-1 ml-4 flex flex-col gap-0.5 border-l pl-3">
                                        <>
                                            {wallets.map((w) => (
                                                <button
                                                    key={w.id}
                                                    className="group text-text-secondary hover:text-text-primary hover:bg-elevated hover:border-accent flex w-full items-center justify-between rounded-md px-2 py-2 transition-all hover:cursor-pointer"
                                                >
                                                    <div className="flex min-w-0 items-center gap-1.5">
                                                        <WalletIcon
                                                            size={13}
                                                            className="shrink-0"
                                                        />
                                                        <span className="truncate text-xs">
                                                            {w.name}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`ml-2 shrink-0 text-xs font-medium ${w.startingBalance >= 0 ? 'text-accent' : 'text-expense'}`}
                                                    >
                                                        ₱{w.startingBalance.toLocaleString()}
                                                    </span>
                                                </button>
                                            ))}
                                            {wallets.length < 10 && (
                                                <button
                                                    onClick={() => setShowModal(true)}
                                                    className="text-text-muted hover:text-accent-hover hover:bg-accent/10 flex items-center gap-1.5 rounded-md px-2 py-2 text-xs transition-all hover:cursor-pointer hover:font-medium"
                                                >
                                                    <Plus size={12} />
                                                    Add Wallet
                                                </button>
                                            )}
                                        </>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    const isActive = location.pathname === path
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

            <div className="border-border flex items-center justify-between border-t pt-3">
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
                        onClick={handleLogout}
                        className="text-text-muted hover:text-expense cursor-pointer transition-colors"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>

            {showModal && (
                <AddWalletModal onClose={() => setShowModal(false)} onSubmit={createWallet} />
            )}
        </aside>
    )
}
