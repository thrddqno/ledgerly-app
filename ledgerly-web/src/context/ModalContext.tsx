import { createContext, useContext, useState } from 'react'
import { AddWalletModal } from '../components/modals/AddWalletModal.tsx'

// 1. Register every modal type + its payload shape here
type ModalConfig =
    | { type: 'addWallet'; payload?: never }
    | { type: 'addTransaction'; payload?: never }
// When you need to pass data, e.g. editing:
// | { type: 'editWallet'; payload: WalletDetail }
// | { type: 'editTransaction'; payload: TransactionDetail }

type ModalType = ModalConfig['type']

interface ModalContextType {
    openModal: (config: ModalConfig) => void
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState<ModalConfig | null>(null)

    const openModal = (config: ModalConfig) => setActive(config)
    const closeModal = () => setActive(null)

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {/* 2. Register modal rendering here */}
            {active?.type === 'addWallet' && <AddWalletModal onClose={closeModal} />}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const ctx = useContext(ModalContext)
    if (!ctx) throw new Error('useModal must be used inside ModalProvider')
    return ctx
}
