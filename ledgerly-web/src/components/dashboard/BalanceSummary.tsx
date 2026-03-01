import { getWalletBalance, type Wallet } from '../../types/wallet.ts'

interface BalanceSummaryProps {
    wallets: Wallet[]
}

export default function BalanceSummary({ wallets }: BalanceSummaryProps) {
    const total = wallets.reduce((sum, w) => sum + getWalletBalance(w), 0)
    const formatted = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(total)

    return (
        <div className="bg-surface border-border flex flex-col gap-1.5 rounded-2xl border p-5">
            <span className="text-text-secondary text-xs font-semibold tracking-widest uppercase">
                Current Balance
            </span>
            <span
                className={`${total > 0 ? 'text-income' : total < 0 ? 'text-expense' : 'text-text-primary'} text-[2rem] leading-none font-bold tracking-tight`}
            >
                {formatted}
            </span>
            <span className="text-text-secondary text-subtle mt-0.5 text-xs">
                Across {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
            </span>
        </div>
    )
}
