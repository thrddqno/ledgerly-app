// hooks/useWallets.ts
import { useEffect, useState } from 'react'
import {
    getWalletsDetailed,
    createWallet as createWalletRequest,
    updateWallet as updateWalletRequest,
    deleteWallet as deleteWalletRequest,
} from '../api/wallet.ts'
import type { Wallet, WalletRequest } from '../types/wallet.ts'
import { useAuth } from '../context/AuthenticationContext.tsx'

export function useWallets() {
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const { user } = useAuth()

    async function fetchWallets() {
        setIsLoading(true)
        try {
            const data = await getWalletsDetailed()
            setWallets(data)
        } catch (e) {
            setError('Failed to load wallets.')
        } finally {
            setIsLoading(false)
        }
    }

    async function createWallet(data: WalletRequest) {
        const created = await createWalletRequest(data)
        setWallets((prev) => [...prev, created])
    }

    async function updateWallet(id: string, data: WalletRequest) {
        const updated = await updateWalletRequest(id, data)
        setWallets((prev) => prev.map((w) => (w.id === id ? updated : w)))
    }

    async function deleteWallet(id: string) {
        await deleteWalletRequest(id)
        setWallets((prev) => prev.filter((w) => w.id !== id))
    }

    useEffect(() => {
        if (!user) return
        void fetchWallets()
    }, [user])

    const totalBalance = wallets.reduce((sum, w) => sum + w.startingBalance, 0)

    return { wallets, isLoading, error, totalBalance, createWallet, updateWallet, deleteWallet }
}
