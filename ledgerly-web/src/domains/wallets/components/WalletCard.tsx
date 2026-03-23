import { WalletIcon } from 'lucide-react'
import { useCallback } from 'react'

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

    const handleClick = useCallback(() => {
        if (isSelectedWallet) {
            setSelectedWalletId(null)
            return
        }
        setSelectedWalletId(wallet.id)
    }, [isSelectedWallet, setSelectedWalletId, wallet.id])

    return (
        <button
            onClick={handleClick}
            className={`cursor-pointer transition-all p-5 w-full shrink-0 h-25 rounded-field bg-base-100 border hover:bg-base-100/10  ${isSelectedWallet ? 'border-accent hover:bg-accent/85' : 'border-base-300  bg-base-100'}`}
        >
            <div className="flex flex-col items-start gap-1">
                <div className="flex flex-row items-center justify-start gap-3">
                    <div
                        className={`flex transition-all bg-base-content/10 h-8 w-8 rounded-selector items-center justify-center`}
                    >
                        <WalletIcon
                            className={`w-4 transition-all text-base-content`}
                        />
                    </div>
                    <span className={`text-primary text-md truncate`}>
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
    )
}
