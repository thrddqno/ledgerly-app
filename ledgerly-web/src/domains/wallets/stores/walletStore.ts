import { create } from 'zustand'

interface WalletStore {
    selectedWalletId: string | null
    setSelectedWalletId: (id: string | null) => void
}

export const useWalletStore = create<WalletStore>((set) => ({
    selectedWalletId: null,
    setSelectedWalletId: (id: string | null) => set({ selectedWalletId: id }),
}))
