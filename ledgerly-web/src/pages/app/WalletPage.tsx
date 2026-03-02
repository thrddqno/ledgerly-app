import SideBar from '../../components/layout/SideBar.tsx'
import { useDevice } from '../../context/DeviceContext.tsx'
import WalletList from '../../components/dashboard/WalletList.tsx'
import type { Wallet } from '../../types/wallet.ts'
import { useState } from 'react'
import { Trash } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useTransactions } from '../../hooks/useTransactions.ts'
import TransactionsPanel from '../../components/TransactionsPanel.tsx'

export default function WalletPage() {
    const location = useLocation()
    const { breakpoint } = useDevice()

    const { state } = location
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(state?.wallet || null)
    const { transactions, isLoading, hasMore, loadMore } = useTransactions({
        walletId: selectedWallet?.id,
        size: 10,
    })

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

            <div className="border-border flex flex-1 flex-col border-r p-7">
                <div className="mx-auto flex max-w-9/12 flex-1 flex-col gap-4 overflow-hidden">
                    <WalletList
                        modifiable={true}
                        selectedWallet={selectedWallet}
                        onWalletSelect={handleWalletSelect}
                    />

                    {!selectedWallet ? (
                        <div className="text-text-muted flex flex-1 flex-col items-center justify-center gap-2 text-sm">
                            <Trash className="opacity-50" />
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
