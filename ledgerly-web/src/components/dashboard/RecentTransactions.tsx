import type { Transaction } from '../../types/transaction.ts'
import { formatDate, formatTime } from '../../utils/formatter/dateFormatters.ts'
import { formatCurrency } from '../../utils/formatter/currencyFormatter.ts'
import { useWallets } from '../../context/WalletContext.tsx'
import { useCategories } from '../../context/CategoryContext.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { parseIcon } from '../../utils/parseIcon.ts'

interface Props {
    transactions: Transaction[]
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

export default function RecentTransactions({ transactions }: Props) {
    const { allCategories } = useCategories()
    const { wallets } = useWallets()
    const groups = groupByDate(transactions)

    return (
        <div className="flex h-full flex-col overflow-hidden">
            {/* Pinned header */}
            <div className="bg-surface border-border shrink-0 border-b px-6 pt-6 pb-4">
                <h2 className="text-text-primary text-content text-sm font-semibold">
                    Recent Transactions
                </h2>
                <p className="text-text-secondary text-subtle mt-0.5 text-xs">
                    All wallets · Last 30 days
                </p>
            </div>

            {/* Independently scrolling list */}
            <div className="flex-1 space-y-7 overflow-y-auto px-6 py-5">
                {groups.length === 0 && (
                    <div className="text-text-primary text-subtle flex h-40 items-center justify-center text-sm">
                        No transactions yet.
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
                                        style={{ backgroundColor: tx.category.color }} // hex + ~16% opacity
                                    >
                                        {tx.category && (
                                            <FontAwesomeIcon
                                                icon={parseIcon(tx.category.icon)}
                                                className="text-sm text-white"
                                            />
                                        )}
                                    </div>

                                    {/* Description + wallet · category */}
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="text-text-primary truncate text-sm font-medium">
                                            {tx.notes ?? tx.category.name}
                                        </span>
                                        <span className="text-text-secondary mt-0.5 text-xs">
                                            {wallets.find((w) => w.id == tx.walletId)?.name ??
                                                'Unknown Wallet'}
                                        </span>
                                    </div>

                                    {/* Right: amount + time */}
                                    <div className="text-text-muted ml-6 flex shrink-0 flex-col items-end">
                                        <span
                                            className={`text-sm font-semibold tabular-nums ${
                                                tx.transactionType === 'INCOME'
                                                    ? 'text-emerald-400'
                                                    : 'text-rose-400'
                                            }`}
                                        >
                                            {tx.transactionType === 'INCOME' ? '+' : '-'}
                                            {formatCurrency(tx.amount, 'PHP')}
                                        </span>
                                        <span className="text-subtle mt-0.5 text-xs">
                                            {formatTime(tx.date)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
