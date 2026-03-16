//response whenever getting wallet.
export interface Wallet {
    id: string
    name: string
    startingBalance: number
    cachedTransactions: number
    createdAt: string
}

// wallet request for creating wallet
export interface WalletRequest {
    name: string
    startingBalance: number
}

export function getWalletBalance(wallet: Wallet) {
    return wallet.startingBalance + wallet.cachedTransactions
}
