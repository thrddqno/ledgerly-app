import { useCallback, useRef } from 'react'
import WalletCard from './WalletCard.tsx'
import { PackageOpen } from 'lucide-react'
import type { Wallet } from '../types/wallet.ts'
import { useWallets } from '../hooks/useWallets.ts'
import { useModal } from '../../../../common/context/ModalContext.tsx'

interface Props {
    onWalletSelect?: (wallet: Wallet | null) => void
    selectedWallet: Wallet | null
    modifiable?: boolean
}

export default function WalletList({ onWalletSelect, selectedWallet, modifiable }: Props) {
    const { wallets } = useWallets()
    const { openModal } = useModal()
    const MAX_WALLETS = 10

    const scrollRef = useRef<HTMLDivElement>(null)

    const handleClick = (wallet: Wallet) => {
        const next = selectedWallet?.id === wallet.id ? null : wallet
        onWalletSelect?.(next)
    }

    const handleEditWallet = useCallback(
        (wallet: Wallet) => {
            openModal({ type: 'editWallet', payload: wallet })
        },
        [openModal]
    )

    return (
        <div className="flex flex-col gap-3 pb-3 select-none">
            <div className="flex h-5 items-center justify-between">
                <span className="text-text-secondary text-xs font-semibold tracking-widest uppercase">
                    Wallets
                </span>
            </div>

            {wallets.length === 0 && !modifiable ? (
                <div className="text-text-secondary border-border flex h-28 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm">
                    <PackageOpen className="h-6 opacity-40" />
                    <span className="opacity-60">No wallets yet</span>
                </div>
            ) : (
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="col-span-full grid grid-cols-2 gap-2 overflow-hidden pb-1 select-none md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {wallets.map((wallet) => (
                            <WalletCard
                                modifiable={!!modifiable}
                                key={wallet.id}
                                wallet={wallet}
                                isSelected={selectedWallet?.id === wallet.id}
                                onClick={handleClick}
                                {...(modifiable && { onEdit: handleEditWallet })}
                            />
                        ))}

                        {wallets.length < MAX_WALLETS && modifiable && (
                            <button
                                onClick={() =>
                                    openModal({
                                        type: 'addWallet',
                                        payload: {
                                            onCreated: (wallet: Wallet) => {
                                                onWalletSelect?.(wallet)
                                            },
                                        },
                                    })
                                }
                                className="hover:bg-elevated text-text-muted/50 min-h-18 w-full cursor-pointer rounded-md border border-dashed py-2.5 text-xs font-semibold transition-colors duration-150"
                            >
                                + Add Wallet
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
