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
                onClick={() => {
                    setSelectedWalletId(wallet.id)
                }}
                className={`cursor-pointer transition-all p-5 bg-base-100 w-full shrink-0 h-25 rounded-field border ${isSelectedWallet ? 'border-accent border' : 'hover:bg-base-100/10 border-base-300'}`}
            >
                <div className="flex w-full flex-row items-center gap-4">
                    <div className="flex border-accent border-2 h-10 w-10 rounded-3xl items-center justify-center">
                        <WalletIcon className="w-5 text-accent" />
                    </div>
                    <div className="flex min-w-0 flex-col items-start">
                        <span className="text-primary max-tablet:text-xs max-desktop:text-sm max-phone:text-[0.75rem] truncate">
                            {wallet ? wallet.name : 'Wallet'}
                        </span>
                        <span
                            className={`text-sm w-full truncate font-semibold tabular-nums ${isPositive ? 'text-success' : 'text-error'} `}
                        >
                            {isPositive ? '+' : ''}
                            {formatted}
                        </span>
                    </div>
                </div>
            </button>
        </div>
    )
}
