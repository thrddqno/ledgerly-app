import { WalletIcon } from 'lucide-react'

import { formatCurrency } from '../../../shared/utils/currencyFormatter.ts'
import { useWalletStore } from '../stores/walletStore.ts'
import { getWalletBalance, type Wallet } from '../types/wallet.ts'

type Props = {
    wallet: Wallet
}

export default function WalletCard({ wallet }: Props) {
    const balance = getWalletBalance(wallet)
    const isPositive = balance >= 0
    const formatted = formatCurrency(balance)
    const { selectedWalletId, setSelectedWalletId } = useWalletStore()
    const isSelectedWallet = selectedWalletId === wallet.id

    return (
        <div className="group relative">
            <button
                onClick={
                    isSelectedWallet
                        ? () => setSelectedWalletId('')
                        : () => setSelectedWalletId(wallet.id)
                }
                className={`cursor-pointer transition-all p-5 w-full shrink-0 h-25 rounded-field border border-base-300 ${isSelectedWallet ? 'bg-accent hover:bg-accent/85' : 'hover:bg-base-100/10 bg-base-100'}`}
            >
                <div className="flex w-full flex-col items-start gap-1">
                    <div className="flex flex-row items-center justify-start gap-3">
                        <div
                            className={`flex transition-all  ${isSelectedWallet ? 'bg-accent-content/10' : 'bg-base-content/10'} h-8 w-8 rounded-selector items-center justify-center`}
                        >
                            <WalletIcon
                                className={`w-4 transition-all ${isSelectedWallet ? 'text-accent-content' : 'text-base-content'}`}
                            />
                        </div>
                        <span
                            className={`${isSelectedWallet ? 'text-accent-content' : 'text-primary'} text-md truncate`}
                        >
                            {wallet.name}
                        </span>
                    </div>
                    <span
                        className={`text-md truncate font-bold tabular-nums ${isPositive ? 'text-success' : 'text-error'} `}
                    >
                        {isPositive ? '+' : ''}
                        {formatted}
                    </span>
                </div>
            </button>
        </div>
    )
}
