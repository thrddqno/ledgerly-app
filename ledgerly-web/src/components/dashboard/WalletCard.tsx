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
            className={`text-text-primary flex h-28 w-48 shrink-0 cursor-pointer flex-col justify-center gap-2 rounded-xl border p-4 text-left transition-all duration-150 ${
                isSelected
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-surface hover:border-border-hover hover:shadow-sm'
            } `}
        >
            <div className="flex w-full flex-row items-center gap-2">
                <FontAwesomeIcon icon={faWallet} className="text-2xl text-taupe-500" />
                <div className="flex min-w-0 flex-col items-start">
                    <span className="text-text-primary truncate px-1 text-sm font-bold">
                        {wallet.name}
                    </span>
                    <span className={`tabular-nums ${isPositive ? 'text-accent' : 'text-danger'}`}>
                        {isPositive ? '+' : ''}
                        {formatted}
                    </span>
                </div>
            </div>
        </button>
    )
}
