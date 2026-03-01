import {
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Plus,
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
import AddWalletModal from '../modals/AddWalletModal.tsx'

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

    async function handleLogout() {
        await logout()
        navigate('/auth')
    }

    return (
        <aside className="bg-base border-border flex w-65 shrink-0 flex-col border-r px-4 py-6">
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
                                    className="text-text-primary hover:text-text-primary flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-white/3"
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
                                        {wallets.length === 0 ? (
                                            <button
                                                onClick={() => setShowModal(true)}
                                                className="text-accent hover:text-text-primary flex items-center gap-1.5 rounded-md px-2 py-2 text-sm transition-all hover:bg-white/3"
                                            >
                                                <Plus size={16} />
                                                Add Wallet
                                            </button>
                                        ) : (
                                            <>
                                                {wallets.map((w) => (
                                                    <button
                                                        key={w.id}
                                                        className="text-text-primary flex items-center justify-between rounded-md px-2 py-2 text-sm transition-all hover:bg-white/3"
                                                    >
                                                        <div className="flex items-center gap-1.5 truncate">
                                                            <WalletIcon size={16} />
                                                            <span className="truncate">
                                                                {w.name}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={
                                                                w.startingBalance >= 0
                                                                    ? 'text-accent'
                                                                    : 'text-expense'
                                                            }
                                                        >
                                                            ₱{w.startingBalance.toLocaleString()}
                                                        </span>
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setShowModal(true)}
                                                    className="text-text-muted hover:text-accent flex items-center gap-1.5 rounded-md px-2 py-2 text-sm transition-all"
                                                >
                                                    <Plus size={14} />
                                                    Add Wallet
                                                </button>
                                            </>
                                        )}
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
                                    : 'text-text-primary hover:text-text-primary font-normal hover:bg-white/3'
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
                <button
                    onClick={handleLogout}
                    className="text-text-muted hover:text-expense cursor-pointer transition-colors"
                >
                    <LogOut size={15} />
                </button>
            </div>

            {showModal && (
                <AddWalletModal onClose={() => setShowModal(false)} onSubmit={createWallet} />
            )}
        </aside>
    )
}
