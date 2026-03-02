import { createContext, useContext, useMemo, useState } from 'react'
import { AddWalletModal } from '../components/modals/AddWalletModal.tsx'
import { PromptLogoutModal } from '../components/modals/PromptLogoutModal.tsx'

// 1. Register every modal type + its payload shape here
type ModalConfig = { type: 'addWallet'; payload?: never } | { type: 'logout'; payload?: never }

type ModalType = ModalConfig['type']

interface ModalContextType {
    openModal: (config: ModalConfig) => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState<ModalConfig | null>(null)

    const openModal = (config: ModalConfig) => setActive(config)
    const closeModal = () => setActive(null)

    const value = useMemo(
        () => ({
            openModal,
        }),
        []
    )

    return (
        <ModalContext.Provider value={value}>
            {children}
            {active?.type === 'logout' && <PromptLogoutModal onClose={closeModal} />}
            {active?.type === 'addWallet' && <AddWalletModal onClose={closeModal} />}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const ctx = useContext(ModalContext)
    if (!ctx) throw new Error('useModal must be used inside ModalProvider')
    return ctx
}
