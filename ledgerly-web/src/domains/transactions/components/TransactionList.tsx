import { faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Plus } from 'lucide-react'
import { useRef } from 'react'

import { useInfiniteScroll } from '../../../shared/ui/hooks/useInfiniteScroll.ts'
import { formatCurrency } from '../../../shared/utils/currencyFormatter.ts'
import { DateFormatter } from '../../../shared/utils/dateFormatter.ts'
import { useWallets } from '../../wallets/hooks/useWallets.ts'
import type { Transaction } from '../types/transaction.ts'
import { TransactionListItem } from './TransactionListItem.tsx'

interface Props {
    transactions?: Transaction[]
    isLoading?: boolean
    onFetchNextPage?: () => void
}

const isInFlow = (transaction: Transaction): boolean => {
    if (transaction.categoryResponse.transactionType === 'INCOME') return true
    return transaction.transfer && transaction.isIncoming
}

const dateFormatter = new DateFormatter(
    { month: 'long', day: 'numeric', year: 'numeric' },
    true
)

function groupByDate(
    transactions: Transaction[] | undefined
): [string, Transaction[], number][] {
    const map = new Map<string, Transaction[]>()

    for (const tx of transactions) {
        const label = dateFormatter.formatDate(tx.date)
        const existing = map.get(label) ?? []

        map.set(label, [...existing, tx])
    }
    return Array.from(map.entries()).map(([label, txs]) => [
        label,
        txs,
        txs.reduce(
            (sum, tx) => sum + (isInFlow(tx) ? tx.amount : -tx.amount),
            0
        ),
    ])
}

export function TransactionList({
    transactions,
    isLoading,
    onFetchNextPage,
}: Props) {
    const sentinel = useRef<HTMLDivElement>(null)
    const groups = groupByDate(transactions)
    const { data: wallets } = useWallets()
    useInfiniteScroll(onFetchNextPage, isLoading, sentinel)

    const isPositive = (total: number) => {
        return total > 0
    }

    return (
        <div className="flex flex-col">
            <button
                className={
                    'rounded-field bg-accent cursor-pointer hover:bg-accent/80 transition-all font-semibold text-accent-content w-fit text-sm items-center px-3 py-1.5 gap-1 flex flex-row'
                }
            >
                <Plus size={16} />
                Add Transaction
            </button>

            {transactions?.length === 0 && (
                <div
                    className={
                        'flex flex-col justify-center text-base-content/30 cursor-default items-center h-1/2'
                    }
                >
                    <FontAwesomeIcon icon={faBoxOpen} />
                    <span>No Transactions</span>
                </div>
            )}
            {groups.map(([dateLabel, txs, total]) => (
                <div key={dateLabel} className={'w-full mb-3'}>
                    <div
                        className={
                            'flex items-center uppercase font py-2 font-bold text-[0.7rem] text-base-content/30 justify-between'
                        }
                    >
                        <span>{dateLabel}</span>
                        <span className={'text-xs mr-5'}>
                            {isPositive(total) ? '+' : ''}
                            {formatCurrency(total)}
                        </span>
                    </div>

                    <div
                        className={
                            'bg-base-100 border border-base-300 px-2 py-2'
                        }
                    >
                        {txs.map((tx, i) => (
                            <TransactionListItem
                                key={tx.id}
                                transaction={tx}
                                wallets={wallets}
                            />
                        ))}
                    </div>
                </div>
            ))}
            <div ref={sentinel} className="h-1" />
        </div>
    )
}
