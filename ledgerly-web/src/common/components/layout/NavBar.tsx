import {
    ChevronDown,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Moon,
    Settings,
    Sun,
    Tag,
    User,
    WalletIcon,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthenticationContext.tsx'
import { useDevice } from '../../context/DeviceContext.tsx'
import type { Wallet } from '../../../features/app/wallets/types/wallet.ts'
import { useEffect, useState } from 'react'
import { useUIContext } from '../../context/UIContext.tsx'
import { useModal } from '../../context/ModalContext.tsx'
import { useTheme } from '../../hooks/useTheme.ts'
import WalletCarousel from '../../../features/app/wallets/components/WalletCarousel.tsx'
import { useBackdrop } from '../../context/BackdropContext.tsx'

interface Props {
    selectedWallet?: Wallet | null
    onWalletSelect?: (wallet: Wallet | null) => void
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: WalletIcon, label: 'Wallets', path: '/wallets' },
    { icon: Tag, label: 'Categories', path: '/' },
]

export default function NavBar({ selectedWallet, onWalletSelect }: Props) {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { activePage } = useUIContext()
    const { breakpoint } = useDevice()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isShowWalletCarouselOpen, setIsShowWalletCarouselOpen] = useState(false)
    const { openModal } = useModal()
    const { show, hide } = useBackdrop()

    useEffect(() => {
        if (isUserMenuOpen || isShowWalletCarouselOpen) {
            show(() => {
                setIsUserMenuOpen(false)
                setIsShowWalletCarouselOpen(false)
            })
        } else {
            hide()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserMenuOpen, isShowWalletCarouselOpen])

    //todo: REFACTOR NAVBAR TO DIFFERENT COMPONENTS (EG. DESKTOPNAVBAR, MOBILENAVBAR ETC)

    return (
        <>
            <div className="bg-surface fixed z-50 flex h-18 w-screen shrink-0 flex-row justify-between px-4 shadow-md">
                <button
                    className="flex cursor-pointer flex-col items-center justify-center p-2"
                    onClick={() => {
                        navigate('/dashboard')
                    }}
                >
                    <span className="text-accent text-3xl font-extrabold">Ledgerly</span>

                    <span className="text-text-primary text-[0.6rem] font-extrabold">
                        Personal Finance Coach
                    </span>
                </button>

                {activePage === '/wallets' && selectedWallet && (
                    <>
                        <button
                            className="te text-text-secondary flex cursor-pointer flex-row items-center justify-center gap-2 p-2 text-xl font-bold"
                            onClick={() => {
                                setIsShowWalletCarouselOpen(!isShowWalletCarouselOpen)
                                setIsUserMenuOpen(false)
                            }}
                        >
                            {selectedWallet?.name ?? 'Wallets'}
                            <ChevronDown className="text-text-muted/50 mt-1 h-5 w-5" />
                        </button>

                        {/* WALLET CAROUSEL */}
                        <div
                            className={`bg-surface absolute top-full left-0 z-60 w-full rounded-sm p-5 font-semibold shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out ${
                                isShowWalletCarouselOpen
                                    ? 'translate-y-0 opacity-100'
                                    : 'pointer-events-none -translate-y-2 opacity-0'
                            } `}
                        >
                            <WalletCarousel
                                selectedWallet={selectedWallet}
                                onWalletSelect={(wallet) => {
                                    setIsShowWalletCarouselOpen(!isShowWalletCarouselOpen)
                                    onWalletSelect?.(wallet)
                                    if (!wallet) {
                                        setIsShowWalletCarouselOpen(false)
                                    }
                                }}
                            />
                        </div>
                    </>
                )}

                {breakpoint != 'phone' && (
                    <>
                        {activePage != '/wallets' && (
                            <nav className="flex flex-1 flex-row justify-center gap-4">
                                {navItems.map(({ icon: Icon, label, path }) => {
                                    const isActive = activePage === path
                                    return (
                                        <button
                                            key={label}
                                            onClick={() => navigate(path)}
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
                        )}

                        {/* SETTINGS DROPDOWN */}

                        <div className="my-4 mr-4 flex items-center justify-between pl-5">
                            <button
                                className="flex cursor-pointer items-center gap-2.5 outline-none"
                                onClick={() => {
                                    setIsUserMenuOpen(!isUserMenuOpen)
                                    setIsShowWalletCarouselOpen(false)
                                }}
                            >
                                <span className="bg-accent flex h-8 w-8 items-center justify-center rounded-full">
                                    <User size={20} />
                                </span>
                                <span className="text-text-primary text-[13px] font-semibold">
                                    {user?.firstName}
                                </span>
                                <ChevronDown
                                    className={`text-text-muted/50 h-5 w-5 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                        </div>

                        <div
                            className={`bg-surface absolute top-full right-2 z-60 mt-2 w-48 origin-top-right rounded-sm py-1 font-semibold shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out ${
                                isUserMenuOpen
                                    ? 'translate-y-0 opacity-100'
                                    : 'pointer-events-none -translate-y-2 opacity-0'
                            }`}
                        >
                            <button className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm">
                                <Settings size={16} /> Account Settings
                            </button>
                            <button className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm">
                                <CreditCard size={16} /> Billing
                            </button>
                            <button
                                onClick={() => {
                                    toggleTheme()
                                    setIsUserMenuOpen(false)
                                }}
                                className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm"
                            >
                                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />} Theme
                            </button>
                            <button
                                onClick={() => {
                                    openModal({ type: 'logout' })
                                    setIsUserMenuOpen(false)
                                }}
                                className="border-border text-danger flex w-full cursor-pointer items-center gap-2 border-t px-4 py-2 text-sm hover:text-red-700"
                            >
                                <LogOut size={16} /> Sign out
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
