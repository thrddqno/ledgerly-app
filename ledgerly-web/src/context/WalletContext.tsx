import { createContext, useContext } from 'react'
import { useWallets as useWalletsHook } from '../hooks/useWallets.ts'
import type { Wallet, WalletRequest } from '../types/wallet'

interface WalletContextType {
    wallets: Wallet[]
    isLoading: boolean
    error: string
    totalBalance: number
    createWallet: (data: WalletRequest) => Promise<void>
    updateWallet: (id: string, data: WalletRequest) => Promise<void>
    deleteWallet: (id: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const walletState = useWalletsHook()

    return <WalletContext.Provider value={walletState}>{children}</WalletContext.Provider>
}

export function useWallets() {
    const ctx = useContext(WalletContext)
    if (!ctx) throw new Error('useWallets must be used inside WalletProvider')
    return ctx
}
