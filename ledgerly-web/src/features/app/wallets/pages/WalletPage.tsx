import { useDevice } from '../../../../common/context/DeviceContext.tsx'
import WalletList from '../components/WalletList.tsx'
import type { Wallet } from '../types/wallet.ts'
import { useState } from 'react'
import { Trash } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useTransactions } from '../../transactions/hooks/useTransactions.ts'
import TransactionsPanel from '../components/TransactionsPanel.tsx'
import NavBar from '../../../../common/components/layout/NavBar.tsx'
import WalletCarousel from '../components/WalletCarousel.tsx'

export default function WalletPage() {
    const location = useLocation()
    const { breakpoint } = useDevice()

    const { state } = location
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(state?.wallet || null)
    const { transactions, isLoading, hasMore, loadMore } = useTransactions({
        walletId: selectedWallet?.id,
        size: 20,
    })

    const handleWalletSelect = (wallet: Wallet | null) => {
        if (!wallet) {
            setSelectedWallet(null)
            return
        }
        setSelectedWallet(wallet)
    }

    return (
        <div>
            <NavBar selectedWallet={selectedWallet} onWalletSelect={handleWalletSelect} />
            <div className="bg-base flex h-screen w-screen justify-between pt-18">
                <div className="border-border flex flex-1 flex-col overflow-y-auto border-r py-4">
                    {!selectedWallet && (
                        <div className="px-4">
                            <WalletList
                                modifiable={true}
                                selectedWallet={selectedWallet}
                                onWalletSelect={handleWalletSelect}
                            />
                        </div>
                    )}

                    {!selectedWallet ? (
                        <div className="text-text-muted flex flex-1 flex-col items-center justify-center gap-2 text-sm">
                            <span>Select wallet to view transactions</span>
                        </div>
                    ) : (
                        <TransactionsPanel
                            transactions={transactions}
                            isLoading={isLoading}
                            resetScroll={selectedWallet?.id}
                            onLoadMore={hasMore ? () => loadMore() : undefined}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
