import SideBar from '../../components/layout/SideBar.tsx'
import { useDevice } from '../../context/DeviceContext.tsx'
import WalletList from '../../components/dashboard/WalletList.tsx'
import type { Wallet } from '../../types/wallet.ts'
import { useState } from 'react'
import { Trash } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function WalletPage() {
    const location = useLocation()
    const { breakpoint } = useDevice()
    const { state } = location
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(state?.wallet || null)

    const handleWalletSelect = (wallet: Wallet | null) => {
        if (!wallet) {
            setSelectedWallet(null)
            return
        }
        setSelectedWallet(wallet)
    }

    return (
        <div className="bg-base flex h-screen w-screen justify-between overflow-hidden">
            {breakpoint === 'desktop' && <SideBar />}

            <div className="border-border flex flex-1 flex-col gap-4 overflow-y-auto border-r p-7">
                <div className="flex flex-col">
                    <WalletList
                        selectedWallet={selectedWallet}
                        onWalletSelect={handleWalletSelect}
                    />
                    <div className="mt-10 flex items-center justify-center gap-2">
                        {!selectedWallet && (
                            <div className="text-text-muted mt-30 flex flex-col items-center gap-2 text-sm">
                                <Trash />
                                Select wallet to view transactions
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
