import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { formatCurrency } from '../../../shared/utils/currencyFormatter.ts'
import { IconParser } from '../../categories/utils/iconParser.ts'
import { useWallet } from '../../wallets/hooks/useWallets.ts'
import type { Transaction } from '../types/transaction.ts'

interface Props {
    transaction: Transaction
}

export function TransactionListItem({ transaction }: Props) {
    const { data: relatedWallet } = useWallet(transaction.relatedWalletId)
    const formatted = formatCurrency(transaction.amount)
    const isPositive =
        transaction.categoryResponse.transactionType === 'INCOME' ||
        (transaction.transfer && transaction.isIncoming)

    return (
        <div className="w-full h-16 px-4 py-2 gap-2 hover:bg-base-300 cursor-default rounded-field justify-between flex flex-row items-center transition-all">
            <div className="flex flex-row gap-5 items-center justify-center">
                <input
                    type="checkbox"
                    className="checkbox checkbox-sm border-base-300 bg-base-100 text-accent-content checked:bg-accent checked:border-accent transition-all"
                />
                <div
                    style={{
                        backgroundColor: transaction.categoryResponse.color,
                    }}
                    className={`flex items-center w-10 h-10 text-accent-content justify-center rounded-field `}
                >
                    <FontAwesomeIcon
                        icon={IconParser.parseIcon(
                            transaction.categoryResponse.icon ??
                                'fa-solid fa-circle-question'
                        )}
                    />
                </div>
                <div className="flex flex-col text-sm gap-1">
                    <span className="text-base-content">
                        {transaction.categoryResponse.name}
                    </span>
                    <span
                        className={`px-1 w-fit -translate-x-1 rounded-field ${
                            transaction.categoryResponse.transactionType ===
                            'EXPENSE'
                                ? 'bg-error/20 text-error'
                                : transaction.categoryResponse
                                        .transactionType === 'TRANSFER'
                                  ? transaction.isIncoming
                                      ? 'bg-success/20 text-success'
                                      : 'bg-error/20 text-error'
                                  : 'bg-success/20 text-success'
                        }  font-bold text-[0.7rem]`}
                    >
                        {transaction.categoryResponse.transactionType}
                    </span>
                </div>
            </div>
            <span className="text-base-content/60 text-sm truncate">
                {transaction.notes}
            </span>
            <div>
                {transaction.transfer && (
                    <div className="text-base-content/60 flex gap-1 text-sm truncate">
                        <span>
                            {`${transaction.isIncoming ? 'From' : 'To'}`}
                        </span>
                        <span className={'font-bold'}>
                            {relatedWallet?.name}
                        </span>
                    </div>
                )}
            </div>
            <span
                className={`font-semibold text-sm truncate ${
                    isPositive ? 'text-success' : 'text-error'
                }`}
            >
                {isPositive ? '+' : '-'}
                {formatted}
            </span>
        </div>
    )
}
