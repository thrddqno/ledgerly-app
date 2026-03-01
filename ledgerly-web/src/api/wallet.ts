// api/api/v1/wallets.ts
import api from './axios.ts'
import type { Wallet, WalletRequest } from '../types/wallet.ts'

// GET /api/v1/wallet/details — full list with all fields
export async function getWalletsDetailed(): Promise<Wallet[]> {
    const response = await api.get('/api/v1/wallet/details')
    return response.data
}

// GET /api/v1/wallet/:id/details — single wallet full detail
export async function getWalletDetailed(id: string): Promise<Wallet> {
    const response = await api.get(`/api/v1/wallet/${id}/details`)
    return response.data
}

// POST /api/v1/wallet
export async function createWallet(data: WalletRequest): Promise<Wallet> {
    const response = await api.post('/api/v1/wallet', data)
    return response.data
}

// POST /api/v1/wallet
export async function updateWallet(id: string, data: WalletRequest): Promise<Wallet> {
    const response = await api.put(`/api/v1/wallet/${id}`, data)
    return response.data
}

// DELETE /api/v1/wallet/:id
export async function deleteWallet(id: string): Promise<void> {
    await api.delete(`/api/v1/wallet/${id}`)
}
