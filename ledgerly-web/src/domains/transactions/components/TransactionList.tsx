import { useEffect, useRef } from 'react'

import { useInfiniteScroll } from '../../../shared/ui/hooks/useInfiniteScroll.ts'
import { formatCurrency } from '../../../shared/utils/currencyFormatter.ts'
import { DateFormatter } from '../../../shared/utils/dateFormatter.ts'
import type { Transaction } from '../types/transaction.ts'
import { TransactionListItem } from './TransactionListItem.tsx'

interface Props {
    transactions?: Transaction[]
    isLoading?: boolean
    onFetchNextPage?: () => void
    resetScroll?: string | null
}

const isInFlow = (transaction: Transaction): boolean => {
    if (transaction.categoryResponse.transactionType === 'INCOME') return true
    return transaction.transfer && transaction.isIncoming
}

function groupByDate(
    transactions: Transaction[]
): [string, Transaction[], number][] {
    const map = new Map<string, Transaction[]>()
    const dateFormatter = new DateFormatter(
        { month: 'long', day: 'numeric', year: 'numeric' },
        true
    )

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
    resetScroll,
}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const groups = groupByDate(transactions)
    useInfiniteScroll(onFetchNextPage, isLoading, scrollRef)

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 })
    }, [resetScroll])

    return (
        <div className="flex gap-5">
            {groups.map(([dateLabel, txs, total]) => (
                <div key={dateLabel} className={'w-full'}>
                    <div
                        className={
                            'flex items-center uppercase font py-2 font-bold text-[0.7rem] text-base-content/30 justify-between'
                        }
                    >
                        <span>{dateLabel}</span>
                        <span className={'text-xs mr-5'}>
                            {formatCurrency(total)}
                        </span>
                    </div>

                    <div
                        className={
                            'bg-base-100 border border-base-300 px-2 py-2'
                        }
                    >
                        {txs.map((tx, i) => (
                            <TransactionListItem key={i} transaction={tx} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
