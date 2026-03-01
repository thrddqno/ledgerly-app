// api/api/v1/wallets.ts
import api from './axios.ts'

// ── Response Types ──────────────────────────────────────

export interface WalletSummary {
    name: string
    balance: number
}

export interface WalletDetail {
    id: string
    name: string
    startingBalance: number
    cachedTransactions: number
    createdAt: string
}

// ── Request Types ────────────────────────────────────────

export interface CreateWalletRequest {
    name: string
    startingBalance: number
}

export interface UpdateWalletRequest {
    name: string
    startingBalance: number
}

// ── Endpoints ────────────────────────────────────────────

// GET /api/v1/wallet — light list (name + balance only)
export async function getWallets(): Promise<WalletSummary[]> {
    const response = await api.get('/api/v1/wallet')
    return response.data
}

// GET /api/v1/wallet/details — full list with all fields
export async function getWalletsDetailed(): Promise<WalletDetail[]> {
    const response = await api.get('/api/v1/wallet/details')
    return response.data
}

// GET /api/v1/wallet/:id — single wallet (name + balance)
export async function getWallet(id: string): Promise<WalletSummary> {
    const response = await api.get(`/api/v1/wallet/${id}`)
    return response.data
}

// GET /api/v1/wallet/:id/details — single wallet full detail
export async function getWalletDetailed(id: string): Promise<WalletDetail> {
    const response = await api.get(`/api/v1/wallet/${id}/details`)
    return response.data
}

// POST /api/v1/wallet
export async function createWallet(data: CreateWalletRequest): Promise<WalletDetail> {
    const response = await api.post('/api/v1/wallet', data)
    return response.data
}

// PUT /api/v1/wallet/:id
export async function updateWallet(id: string, data: UpdateWalletRequest): Promise<WalletDetail> {
    const response = await api.put(`/api/v1/wallet/${id}`, data)
    return response.data
}

// DELETE /api/v1/wallet/:id
export async function deleteWallet(id: string): Promise<void> {
    await api.delete(`/api/v1/wallet/${id}`)
}
