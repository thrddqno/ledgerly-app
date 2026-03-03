export interface Wallet {
    id: string
    name: string
    startingBalance: number
    cachedTransactions: number
    createdAt: string
}

export interface WalletRequest {
    name: string
    startingBalance: number
}

export function getWalletBalance(wallet: Wallet): number {
    return wallet.startingBalance + wallet.cachedTransactions
}
