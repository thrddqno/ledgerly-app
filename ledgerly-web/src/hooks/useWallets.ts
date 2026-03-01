// hooks/useWallets.ts
import { useEffect, useState } from 'react'
import {
    type WalletDetail,
    getWalletsDetailed,
    createWallet as createWalletRequest,
    updateWallet as updateWalletRequest,
    deleteWallet as deleteWalletRequest,
    type CreateWalletRequest,
    type UpdateWalletRequest,
} from '../api/wallet.ts'

export function useWallets() {
    const [wallets, setWallets] = useState<WalletDetail[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    async function fetchWallets() {
        try {
            const data = await getWalletsDetailed()
            setWallets(data)
        } catch (e) {
            setError('Failed to load wallets.')
        } finally {
            setIsLoading(false)
        }
    }

    async function createWallet(data: CreateWalletRequest) {
        const created = await createWalletRequest(data)
        setWallets((prev) => [...prev, created])
    }

    async function updateWallet(id: string, data: UpdateWalletRequest) {
        const updated = await updateWalletRequest(id, data)
        setWallets((prev) => prev.map((w) => (w.id === id ? updated : w)))
    }

    async function deleteWallet(id: string) {
        await deleteWalletRequest(id)
        setWallets((prev) => prev.filter((w) => w.id !== id))
    }

    useEffect(() => {
        void fetchWallets()
    }, [])

    const totalBalance = wallets.reduce((sum, w) => sum + w.startingBalance, 0)

    return { wallets, isLoading, error, totalBalance, createWallet, updateWallet, deleteWallet }
}
