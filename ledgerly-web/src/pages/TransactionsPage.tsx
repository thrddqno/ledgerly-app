import { WalletCarousel } from '../domains/wallets/components/WalletCarousel.tsx'
import NavBar from '../shared/ui/layout/NavBar.tsx'
import SideBar from '../shared/ui/layout/SideBar.tsx'

export default function TransactionsPage() {
    return (
        <div className="bg-base-200 flex flex-row ">
            <SideBar />
            <div className="flex flex-col w-full h-screen overflow-hidden px-7 py-3">
                <NavBar />
                <WalletCarousel />
            </div>
        </div>
    )
}
