import type { Wallet } from '../types/wallet.ts'
import { useWallets } from '../hooks/useWallets.ts'
import { useModal } from '../../../../common/context/ModalContext.tsx'
import { useCallback, useRef } from 'react'
import WalletCard from './WalletCard.tsx'

interface Props {
    onWalletSelect?: (wallet: Wallet | null) => void
    selectedWallet?: Wallet | null
}

export default function WalletCarousel({ onWalletSelect, selectedWallet }: Props) {
    const { wallets } = useWallets()
    const { openModal } = useModal()
    const MAX_WALLETS = 10

    const handleClick = (wallet: Wallet) => {
        const next = selectedWallet?.id === wallet.id ? null : wallet
        onWalletSelect?.(next)
    }
    const scrollRef = useRef<HTMLDivElement>(null)

    const handleEditWallet = useCallback(
        (wallet: Wallet) => {
            openModal({ type: 'editWallet', payload: wallet })
        },
        [openModal]
    )

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                className="scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-border scrollbar-track-transparent col-span-full flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden pb-1 select-none"
            >
                {wallets.map((wallet) => (
                    <div className="min-w-48 shrink-0 snap-start">
                        <WalletCard
                            modifiable={true}
                            key={wallet.id}
                            wallet={wallet}
                            isSelected={selectedWallet?.id === wallet.id}
                            onClick={handleClick}
                            onEdit={handleEditWallet}
                        />
                    </div>
                ))}
                {wallets.length < MAX_WALLETS && (
                    <button
                        onClick={() => openModal({ type: 'addWallet', payload: {
                            onCreated: (wallet: Wallet) => {
                                onWalletSelect?.(wallet)
                            }
                            } })}
                        className="hover:bg-elevated text-text-muted/50 w-48 shrink-0 cursor-pointer snap-start rounded-md border border-dashed py-2.5 text-xs font-semibold transition-colors duration-150"
                    >
                        + Add Wallet
                    </button>
                )}
            </div>
        </div>
    )
}
