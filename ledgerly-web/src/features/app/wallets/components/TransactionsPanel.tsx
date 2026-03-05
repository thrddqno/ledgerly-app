import type { Transaction } from '../../transactions/types/transaction.ts'
import { formatDate } from '../../../../common/utils/dateFormatters.ts'
import { formatCurrency } from '../../../../common/utils/currencyFormatter.ts'
import { useWallets } from '../hooks/useWallets.ts'
import { useInfiniteScroll } from '../../../../common/hooks/useInfiniteScrollOptions.ts'
import { useDevice } from '../../../../common/context/DeviceContext.tsx'
import { useEffect, useRef } from 'react'
import { PackageOpen } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { parseIcon } from '../../categories/utils/parseIcon.ts'

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
        const existing = map.get(label) ?? []
        map.set(label, [...existing, tx])
    }

    return Array.from(map.entries())
}

function calculateDailyNet(transactions: Transaction[]): number {
    return transactions.reduce((sum, tx) => {
        return tx.isIncoming ? sum + tx.amount : sum - tx.amount
    }, 0)
}

export default function TransactionsPanel({
    transactions,
    isLoading,
    onLoadMore,
    resetScroll,
}: Props) {
    const { wallets } = useWallets()
    const { isGreaterThan } = useDevice()
    const scrollRef = useRef<HTMLDivElement>(null)

    const groups = groupByDate(transactions)

    useInfiniteScroll(onLoadMore, isLoading, scrollRef)

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 })
    }, [resetScroll])

    const getWalletName = (walletId: string | undefined): string => {
        if (!walletId) return 'Unknown'
        return wallets.find((w) => w.id === walletId)?.name ?? 'Unknown'
    }

    const renderEmptyState = () => (
        <div className="text-text-muted flex h-full flex-col items-center justify-center gap-2">
            <PackageOpen />
            <div className="text-subtle text-sm">No transactions yet.</div>
        </div>
    )

    const renderLoadingSpinner = () => (
        <div className="flex h-full items-center justify-center">
            <div className="border-accent h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
    )

    const renderTransactionDetails = (tx: Transaction) => {
        if (isGreaterThan('phone')) {
            return (
                <>
                    <span className="text-text-muted max-desktop:w-60 w-40 truncate text-sm font-medium wrap-break-word">
                        {tx.notes ?? ''}
                    </span>
                    <div className="text-text-secondary max-desktop: w-40 text-sm font-bold">
                        {tx.transfer && (
                            <span>
                                {tx.isIncoming ? 'From' : 'To'} {getWalletName(tx.relatedWalletId)}
                            </span>
                        )}
                    </div>
                </>
            )
        }

        return (
            <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-text-primary truncate text-sm font-medium">
                    {tx.transfer
                        ? `${tx.isIncoming ? 'From' : 'To'} ${getWalletName(tx.relatedWalletId)}`
                        : (tx.notes ?? tx.categoryResponse.name)}
                </span>
                <span className="text-text-secondary mt-0.5 text-xs">
                    {tx.categoryResponse.name ?? tx.notes}
                </span>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 top-18 flex flex-col">
            <div
                ref={scrollRef}
                className="max-phone:px-5 scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-border scrollbar-track-transparent flex-1 space-y-7 overflow-y-auto px-10 py-5"
            >
                {isLoading && groups.length === 0 && renderLoadingSpinner()}
                {!isLoading && groups.length === 0 && renderEmptyState()}

                {groups.map(([dateLabel, txs]) => (
                    <div key={dateLabel} className="">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-text-muted text-subtle mb-2.5 text-xs font-semibold tracking-widest uppercase">
                                {dateLabel}
                            </span>
                            <span className="text-text-muted text-subtle mb-2.5 text-xs font-semibold tracking-widest uppercase">
                                {formatCurrency(calculateDailyNet(txs), 'PHP')}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1.5 rounded-sm">
                            {txs.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="bg-surface border-border hover:border-border-hover flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors duration-100"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                                            style={{ backgroundColor: tx.categoryResponse.color }}
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    parseIcon(tx.categoryResponse.icon) ??
                                                    parseIcon('fa-solid fa-circle-question')
                                                }
                                                className="text-sm text-white"
                                            />
                                        </div>
                                        {isGreaterThan('phone') && (
                                            <span className="text-text-secondary max-desktop:w-60 max-tablet:w-30 text-sm font-medium wrap-break-word">
                                                {tx.categoryResponse.name}
                                            </span>
                                        )}
                                    </div>

                                    {renderTransactionDetails(tx)}

                                    <span
                                        className={`ml-6 shrink-0 text-base text-sm font-bold tabular-nums ${
                                            tx.isIncoming ? 'text-income' : 'text-expense'
                                        }`}
                                    >
                                        {tx.isIncoming ? '+' : '-'}
                                        {formatCurrency(tx.amount, 'PHP')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {isLoading && groups.length > 0 && (
                    <div className="flex items-center justify-center py-6">
                        {renderLoadingSpinner()}
                    </div>
                )}
            </div>
        </div>
    )
}
