import { createContext, useContext, useMemo, useState } from 'react'
import { AddWalletModal } from '../../features/app/wallets/components/modals/AddWalletModal.tsx'
import { PromptLogoutModal } from '../components/modals/PromptLogoutModal.tsx'
import { UpdateWalletModal } from '../../features/app/wallets/components/modals/UpdateWalletModal.tsx'
import type { Wallet } from '../../features/app/wallets/types/wallet.ts'
import { PromptDeleteWalletModal } from '../../features/app/wallets/components/modals/PromptDeleteWalletModal.tsx'
import { AddTransactionModal } from '../../features/app/transactions/components/AddTransactionModal.tsx'

// 1. Register every modals type + its payload shape here
type ModalConfig =
    | { type: 'addWallet'; payload?: { onCreated?: (wallet: Wallet) => void } }
    | { type: 'logout'; payload?: never }
    | { type: 'editWallet'; payload?: Wallet }
    | { type: 'deleteWallet'; payload?: Wallet }
    | { type: 'addTransaction'; payload?: never }

type ModalType = ModalConfig['type']

interface ModalContextType {
    openModal: (config: ModalConfig) => void
    isModalActive: boolean
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState<ModalConfig | null>(null)
    const isModalActive = active !== null

    const openModal = (config: ModalConfig) => setActive(config)
    const closeModal = () => setActive(null)

    const value = useMemo(
        () => ({
            openModal,
            isModalActive,
        }),
        [isModalActive]
    )

    return (
        <ModalContext.Provider value={value}>
            {children}
            {active?.type === 'logout' && <PromptLogoutModal onClose={closeModal} />}
            {active?.type === 'addWallet' && (
                <AddWalletModal onClose={closeModal} onCreated={active.payload?.onCreated} />
            )}

            {active?.type === 'editWallet' && active.payload && (
                <UpdateWalletModal onClose={closeModal} wallet={active.payload} />
            )}
            {active?.type === 'deleteWallet' && active.payload && (
                <PromptDeleteWalletModal onClose={closeModal} wallet={active.payload} />
            )}

            {active?.type === 'addTransaction' && <AddTransactionModal onClose={closeModal} />}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const ctx = useContext(ModalContext)
    if (!ctx) throw new Error('useModal must be used inside ModalProvider')
    return ctx
}
