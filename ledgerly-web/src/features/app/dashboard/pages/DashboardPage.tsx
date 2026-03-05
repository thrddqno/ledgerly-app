import BalanceSummary from '../components/BalanceSummary.tsx'
import WalletList from '../../wallets/components/WalletList.tsx'
import TransactionsPanel from '../components/TransactionsPanel.tsx'
import type { Wallet } from '../../wallets/types/wallet.ts'
import { useTransactions } from '../../transactions/hooks/useTransactions.ts'
import { useState } from 'react'
import { useWallets } from '../../wallets/hooks/useWallets.ts'
import { useNavigate } from 'react-router-dom'
import { useDevice } from '../../../../common/context/DeviceContext.tsx'
import NavBar from '../../../../common/components/layout/NavBar.tsx'

const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const TODAY = new Date().toISOString().split('T')[0]

export default function DashboardPage() {
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
    const { wallets } = useWallets()
    const [showTransactions, setShowTransactions] = useState(false)
    const navigate = useNavigate()
    const { breakpoint } = useDevice()

    const { transactions, isLoading, hasMore, loadMore } = useTransactions({
        walletId: selectedWallet?.id,
        startDate: THIRTY_DAYS_AGO,
        endDate: TODAY,
        size: 20,
    })

    const closeTransactions = () => {
        setShowTransactions(false)
        setSelectedWallet(null)
    }

    const handleWalletSelect = (wallet: Wallet | null) => {
        if (!wallet) {
            setSelectedWallet(null)
            return
        }
        if (breakpoint == 'phone') {
            navigate('/wallets', { state: { wallet: wallet } })
        } else {
            setSelectedWallet(wallet)
            setShowTransactions(true)
        }
    }

    return (
        <div className="bg-surface">
            <NavBar />
            <div className="bg-base flex h-screen w-screen justify-between overflow-hidden pt-18">
                {/* breakpoint === 'desktop' && <SideBar /> */}

                <main className="border-border flex flex-1 flex-col gap-4 overflow-y-auto border-r p-4 md:p-5">
                    <BalanceSummary wallets={wallets} />
                    <WalletList
                        selectedWallet={selectedWallet}
                        onWalletSelect={handleWalletSelect}
                    />

                    <button
                        onClick={() => setShowTransactions(true)}
                        className="bg-primary mt-4 rounded-lg px-4 py-3 text-white lg:hidden"
                    >
                        View Recent Transactions
                    </button>
                </main>

                <aside
                    className={`bg-base fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${showTransactions ? 'translate-x-0' : 'translate-x-full'} ${breakpoint === 'tablet' || breakpoint === 'desktop' ? 'w-90' : 'w-full'} /* Large screen override: Reset positioning */ lg:relative lg:z-0 lg:translate-x-0`}
                >
                    <TransactionsPanel
                        onClose={closeTransactions}
                        resetScroll={selectedWallet?.id ?? 'all'}
                        transactions={transactions}
                        isLoading={isLoading}
                        selectedWallet={selectedWallet}
                        onLoadMore={hasMore ? () => loadMore() : undefined}
                    />
                </aside>

                {showTransactions && (
                    <div
                        onClick={closeTransactions}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        aria-hidden="true"
                    />
                )}
            </div>
        </div>
    )
}
