import api from '../../../shared/api/axios.ts'
import type { Wallet, WalletRequest } from '../types/wallet.ts'

export async function getAllWallet(): Promise<Wallet[]> {
    const response = await api.get('/api/v1/wallet/details')
    return response.data
}

export async function getWallet(id: string): Promise<Wallet> {
    const response = await api.get(`/api/v1/wallet/${id}/details`)
    return response.data
}

export async function createWallet(data: WalletRequest): Promise<Wallet> {
    const response = await api.post(`/api/v1/wallet`, data)
    return response.data
}

export async function reorderWallets(walletIds: string[]) {
    const response = await api.patch('api/v1/wallet/reorder', {
        walletIds,
    })
    return response.data
}

export async function updateWallet(
    id: string,
    data: WalletRequest
): Promise<Wallet> {
    const response = await api.put(`/api/v1/wallet/${id}`, data)
    return response.data
}

export async function deleteWallet(id: string): Promise<void> {
    const response = await api.delete(`/api/v1/wallet/${id}`)
    return response.data
}
