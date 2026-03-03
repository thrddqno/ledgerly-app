import type { Transaction } from '../../transactions/types/transaction.ts'
import { formatDate } from '../../../../common/utils/dateFormatters.ts'
import { useWallets } from '../hooks/useWallets.ts'
import { useEffect, useRef } from 'react'
import { PackageOpen } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { parseIcon } from '../../categories/utils/parseIcon.ts'
import { formatCurrency } from '../../../../common/utils/currencyFormatter.ts'
import { useInfiniteScroll } from '../../../../common/hooks/useInfiniteScrollOptions.ts'

interface Props {
    transactions: Transaction[]
    isLoading?: boolean
    onLoadMore?: () => void
    resetScroll: string
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

export default function TransactionsPanel({
    transactions,
    isLoading,
    onLoadMore,
    resetScroll,
}: Props) {
    const { wallets } = useWallets()
    const groups = groupByDate(transactions)

    const scrollRef = useRef<HTMLDivElement>(null)
    useInfiniteScroll(onLoadMore, isLoading, scrollRef)

    const getRelatedWalletName = (relatedWalletId: string | undefined) => {
        if (!relatedWalletId) return 'Unknown'

        const wallet = wallets.find((w) => w.id === relatedWalletId)
        return wallet?.name ?? 'Unknown'
    }

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 })
    }, [resetScroll])

    return (
        <div className="flex h-full flex-col overflow-hidden">
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
                        <span className="text-text-muted text-subtle mb-2.5 block text-xs font-semibold tracking-widest uppercase">
                            {dateLabel}
                        </span>

                        <div className="bg-surface border-border flex flex-col gap-1.5 rounded-md border p-2 px-5">
                            {txs.map((tx, i) => (
                                <div
                                    key={tx.id}
                                    className={`border-border/50 flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-100 ${
                                        i !== txs.length - 1 ? 'border-b' : ''
                                    }`}
                                >
                                    <div className="flex w-60 flex-row items-center gap-2">
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
                                        <span className="text-text-muted truncate text-sm font-medium">
                                            {tx.categoryResponse.name}
                                        </span>
                                    </div>

                                    <span className="text-text-secondary w-50 truncate text-sm font-medium">
                                        {tx.notes ?? ''}
                                    </span>

                                    <div className="text-text-secondary w-60 text-sm font-bold">
                                        {tx.transfer && (
                                            <span>
                                                {tx.isIncoming ? 'From' : 'To'}{' '}
                                                {getRelatedWalletName(tx.relatedWalletId)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-text-muted ml-6 flex shrink-0 flex-col">
                                        <span
                                            className={`text-md font-semibold tabular-nums ${
                                                tx.isIncoming ? 'text-income' : 'text-expense'
                                            }`}
                                        >
                                            {tx.isIncoming ? '+' : '-'}
                                            {formatCurrency(tx.amount, 'PHP')}
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
