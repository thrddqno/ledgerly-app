import SideBar from '../../components/layout/SideBar.tsx'
import { useDevice } from '../../context/DeviceContext.tsx'
import WalletList from '../../components/dashboard/WalletList.tsx'
import type { Wallet } from '../../types/wallet.ts'
import { useState } from 'react'

export default function WalletPage() {
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
    const { breakpoint } = useDevice()

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

            <div className="border-border flex flex-1 flex-col gap-4 overflow-y-auto border-r p-7 md:p-7">
                <div className="flex flex-col px-90">
                    <WalletList
                        selectedWallet={selectedWallet}
                        onWalletSelect={handleWalletSelect}
                    />
                </div>
            </div>
        </div>
    )
}
