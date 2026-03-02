import SideBar from '../../components/layout/SideBar.tsx'
import BalanceSummary from '../../components/dashboard/BalanceSummary.tsx'
import { useWallets } from '../../context/WalletContext.tsx'
import WalletList from '../../components/dashboard/WalletList.tsx'
import RecentTransactionsPanel from '../../components/dashboard/RecentTransactionsPanel.tsx'
import { useTransactions } from '../../context/TransactionContext.tsx'
import { useEffect, useState } from 'react'
import type { Wallet } from '../../types/wallet.ts'

const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const TODAY = new Date().toISOString().split('T')[0]

export default function DashboardPage() {
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
    const { wallets } = useWallets()
    const {
        transactions,
        isLoading,
        hasNext,
        fetchTransactions,
        fetchTransactionsByWallet,
        loadMore,
    } = useTransactions()

    useEffect(() => {
        if (selectedWallet) {
            void fetchTransactionsByWallet(selectedWallet.id, {
                size: 20,
                startDate: THIRTY_DAYS_AGO,
                endDate: TODAY,
            })
        } else {
            void fetchTransactions({ size: 20, startDate: THIRTY_DAYS_AGO, endDate: TODAY })
        }
    }, [selectedWallet])

    return (
        <div className="bg-base flex h-screen w-screen justify-between overflow-hidden">
            <SideBar />

            <main className="border-border flex flex-1 flex-col gap-4 overflow-y-auto border-r p-5">
                <BalanceSummary wallets={wallets} />
                <WalletList onWalletSelect={setSelectedWallet} />
            </main>

            <section className="h-screen w-90 overflow-hidden">
                <RecentTransactionsPanel
                    resetScroll={selectedWallet?.id ?? 'all'}
                    transactions={transactions}
                    isLoading={isLoading}
                    selectedWallet={selectedWallet}
                    onLoadMore={
                        hasNext
                            ? () =>
                                  loadMore(selectedWallet?.id, {
                                      startDate: THIRTY_DAYS_AGO,
                                      endDate: TODAY,
                                      size: 20,
                                  })
                            : undefined
                    }
                />
            </section>
        </div>
    )
}
