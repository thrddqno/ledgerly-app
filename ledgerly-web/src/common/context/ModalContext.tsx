import { createContext, useContext, useMemo, useState } from 'react'
import { AddWalletModal } from '../../features/app/wallets/components/modals/AddWalletModal.tsx'
import { PromptLogoutModal } from '../components/modals/PromptLogoutModal.tsx'
import { UpdateWalletModal } from '../../features/app/wallets/components/modals/UpdateWalletModal.tsx'
import type { Wallet } from '../../features/app/wallets/types/wallet.ts'

// 1. Register every modals type + its payload shape here
type ModalConfig =
    | { type: 'addWallet'; payload?: never }
    | { type: 'logout'; payload?: never }
    | { type: 'editWallet'; payload?: Wallet }

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
            {active?.type === 'addWallet' && <AddWalletModal onClose={closeModal} />}
            {active?.type === 'editWallet' && active.payload && (
                <UpdateWalletModal onClose={closeModal} wallet={active.payload} />
            )}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const ctx = useContext(ModalContext)
    if (!ctx) throw new Error('useModal must be used inside ModalProvider')
    return ctx
}
