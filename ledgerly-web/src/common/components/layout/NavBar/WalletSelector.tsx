import WalletCarousel from '../../../../features/app/wallets/components/WalletCarousel.tsx'
import { ChevronDown } from 'lucide-react'
import type { Wallet } from '../../../../features/app/wallets/types/wallet.ts'

interface Props {
    selectedWallet?: Wallet | null
    onWalletSelect?: (wallet: Wallet | null) => void
    onToggle: () => void
    isOpen: boolean
}

export default function WalletSelector({
    selectedWallet,
    onWalletSelect,
    onToggle,
    isOpen,
}: Props) {
    return (
        <>
            <button
                className="te text-text-secondary flex cursor-pointer flex-row items-center justify-center gap-2 p-2 text-xl font-bold"
                onClick={onToggle}
            >
                {selectedWallet?.name ?? 'Wallets'}
                <ChevronDown
                    className={`text-text-muted/50 ${isOpen ? 'rotate-180' : ''} mt-1 h-5 w-5 transition-transform`}
                />
            </button>

            {/* WALLET CAROUSEL */}
            <div
                className={`bg-surface absolute top-full left-0 z-60 w-full p-5 font-semibold shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out ${
                    isOpen
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-2 opacity-0'
                } `}
            >
                <WalletCarousel
                    selectedWallet={selectedWallet}
                    onWalletSelect={(wallet) => {
                        onToggle()
                        onWalletSelect?.(wallet)
                    }}
                />
            </div>
        </>
    )
}
