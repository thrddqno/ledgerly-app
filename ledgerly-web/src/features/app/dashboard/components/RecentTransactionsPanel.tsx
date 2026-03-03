import type { Transaction } from '../../transactions/types/transaction.ts'
import { formatDate } from '../../../../common/utils/dateFormatters.ts'
import { formatCurrency } from '../../../../common/utils/currencyFormatter.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { parseIcon } from '../../categories/utils/parseIcon.ts'
import { ChevronLeftIcon, ChevronRight, PackageOpen } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Wallet } from '../../wallets/types/wallet.ts'
import { useWallets } from '../../wallets/hooks/useWallets.ts'
import { useNavigate } from 'react-router-dom'
import { useInfiniteScroll } from '../../../../common/hooks/useInfiniteScrollOptions.ts'

interface Props {
    transactions: Transaction[]
    isLoading?: boolean
    onLoadMore?: () => void
    resetScroll: string
    selectedWallet: Wallet | null
    onClose?: () => void
}

function groupByDate(transactions: Transaction[]): [string, Transaction[]][] {
    const map = new Map<string, Transaction[]>()

    for (const tx of transactions) {
        const label = formatDate(tx.date)
        if (!map.has(label)) map.set(label, [])
        map.get(label)!.push(tx)
    }

    return Array.from(map.entries())
}

export default function RecentTransactionsPanel({
    transactions,
    isLoading,
    onLoadMore,
    resetScroll,
    selectedWallet,
    onClose,
}: Props) {
    const { wallets } = useWallets()
    const groups = groupByDate(transactions)
    const navigate = useNavigate()

    const scrollRef = useRef<HTMLDivElement>(null)
    useInfiniteScroll(onLoadMore, isLoading, scrollRef)

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 })
    }, [resetScroll])

    return (
        <div className="flex h-full flex-col overflow-hidden">
            {/* Pinned header */}
            <div className="bg-surface border-border flex shrink-0 items-center justify-between border-b px-6 py-4">
                <div className="flex gap-2">
                    {onClose != null && (
                        <button
                            onClick={() => {
                                onClose()
                            }}
                            className="top-4 left-4 z-10 text-2xl lg:hidden"
                        >
                            <ChevronLeftIcon />
                        </button>
                    )}
                    <div className="flex flex-col gap-1">
                        <h2 className="text-text-primary text-content text-sm font-semibold">
                            Recent Transactions
                        </h2>
                        <p className="text-text-secondary text-subtle text-xs">
                            {selectedWallet?.name || 'All wallets'} · Last 30 days
                        </p>
                    </div>
                </div>

                {selectedWallet && (
                    <button
                        onClick={() => navigate('/wallets', { state: { wallet: selectedWallet } })}
                        className="text-accent hover:text-accent-hover flex items-center gap-1 text-xs font-bold transition-colors duration-100 hover:cursor-pointer"
                    >
                        View in Wallet
                        <ChevronRight className="h-4 w-5" />
                    </button>
                )}
            </div>

            {/* Initial load spinner */}

            {/* Empty state - only show when not loading */}

            {/* Independently scrolling list */}
            <div
                ref={scrollRef}
                className="scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-border scrollbar-track-transparent flex-1 space-y-7 overflow-y-auto px-6 py-5"
            >
                {isLoading && groups.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                        <div className="border-accent h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                    </div>
                )}

                {!isLoading && groups.length === 0 && (
                    <div className="text-text-muted flex h-full flex-col items-center justify-center gap-2">
                        <PackageOpen />
                        <div className="text-subtle flex text-sm">No transactions yet.</div>
                    </div>
                )}

                {groups.map(([dateLabel, txs]) => (
                    <div key={dateLabel}>
                        {/* Date group label */}
                        <span className="text-text-muted text-subtle mb-2.5 block text-xs font-semibold tracking-widest uppercase">
                            {dateLabel}
                        </span>

                        <div className="flex flex-col gap-1.5">
                            {txs.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="bg-surface border-border hover:border-border-hover flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-100"
                                >
                                    {/* Category icon circle */}
                                    <div
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                                        style={{ backgroundColor: tx.categoryResponse.color }} // hex + ~16% opacity
                                    >
                                        {tx.categoryResponse && (
                                            <FontAwesomeIcon
                                                icon={
                                                    parseIcon(tx.categoryResponse.icon) ??
                                                    parseIcon('fa-solid fa-circle-question')
                                                }
                                                className="text-sm text-white"
                                            />
                                        )}
                                    </div>

                                    {/* Description + wallets · category */}
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="text-text-primary truncate text-sm font-medium">
                                            {tx.notes ?? tx.categoryResponse.name}
                                        </span>
                                        <span className="text-text-secondary mt-0.5 text-xs">
                                            {tx.notes ? tx.categoryResponse.name : ''}
                                        </span>
                                    </div>

                                    <div className="text-text-muted ml-6 flex shrink-0 flex-col items-end">
                                        <span
                                            className={`text-sm font-semibold tabular-nums ${
                                                tx.categoryResponse.transactionType === 'INCOME'
                                                    ? 'text-income'
                                                    : 'text-expense'
                                            }`}
                                        >
                                            {tx.categoryResponse.transactionType === 'INCOME'
                                                ? '+'
                                                : '-'}
                                            {formatCurrency(tx.amount, 'PHP')}
                                        </span>
                                        <span className="text-subtle mt-0.5 text-xs">
                                            {wallets.find((w) => w.id == tx.walletId)?.name ||
                                                'Unknown Wallet'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {isLoading && groups.length > 0 && (
                    <div className="flex items-center justify-center py-6">
                        <div className="border-accent h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                    </div>
                )}
            </div>
        </div>
    )
}
