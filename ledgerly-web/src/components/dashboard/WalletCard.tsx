import { getWalletBalance, type Wallet } from '../../types/wallet.ts'
import { formatCurrency } from '../../utils/formatter/currencyFormatter.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'

interface Props {
    wallet: Wallet
    isSelected: boolean
    onClick: (wallet: Wallet) => void
}

export default function WalletCard({ wallet, isSelected, onClick }: Props) {
    const balance = getWalletBalance(wallet)
    const isPositive = balance >= 0
    const formatted = formatCurrency(balance, 'PHP')

    return (
        <button
            onClick={() => onClick(wallet)}
            className={`text-text-primary flex w-48 flex-shrink-0 cursor-pointer flex-col justify-center gap-2 rounded-xl border p-4 text-left transition-all duration-150 ${
                isSelected
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-surface hover:border-border-hover hover:shadow-sm'
            } `}
        >
            {/* Color dot + name */}
            <div className="flex min-w-0 items-center gap-2.5">
                <FontAwesomeIcon icon={faWallet} className="h-4 w-4 text-taupe-600" />
                <span className="text-content truncate text-sm font-medium">{wallet.name}</span>
            </div>

            {/* Balance */}
            <span
                className={`text-sm font-bold tabular-nums ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}
            >
                {isPositive ? '+' : ''}
                {formatted}
            </span>
        </button>
    )
}
