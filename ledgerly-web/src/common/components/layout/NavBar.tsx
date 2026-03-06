import { LayoutDashboard, Tag, WalletIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDevice } from '../../context/DeviceContext.tsx'
import type { Wallet } from '../../../features/app/wallets/types/wallet.ts'
import { useUIContext } from '../../context/UIContext.tsx'
import { useBackdropToggle } from '../../hooks/useBackdropToggle.ts'
import NavBarLogo from './NavBar/NavBarLogo.tsx'
import NavMenu from './NavBar/NavMenu.tsx'
import WalletSelector from './NavBar/WalletSelector.tsx'
import UserMenu from './NavBar/UserMenu.tsx'

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

    const { activePage } = useUIContext()
    const { breakpoint } = useDevice()
    const userMenu = useBackdropToggle('dropdown')
    const walletCarousel = useBackdropToggle('dropdown')

    //todo: REFACTOR NAVBAR TO DIFFERENT COMPONENTS (EG. DESKTOPNAVBAR, MOBILENAVBAR ETC)

    return (
        <>
            <div className="bg-surface fixed z-20 flex h-18 w-screen shrink-0 flex-row justify-between px-4 shadow-md">
                <NavBarLogo />

                {activePage === '/wallets' && selectedWallet && (
                    <WalletSelector
                        selectedWallet={selectedWallet}
                        onWalletSelect={onWalletSelect}
                        isOpen={walletCarousel.isOpen}
                        onToggle={() => {
                            userMenu.close()
                            walletCarousel.isOpen ? walletCarousel.close() : walletCarousel.open()
                        }}
                    />
                )}

                {breakpoint != 'phone' && (
                    <>
                        {activePage != '/wallets' && <NavMenu />}

                        {/* SETTINGS DROPDOWN */}
                        <UserMenu
                            isOpen={userMenu.isOpen}
                            onToggle={() => {
                                walletCarousel.close()
                                userMenu.isOpen ? userMenu.close() : userMenu.open()
                            }}
                        />
                    </>
                )}
            </div>
        </>
    )
}
