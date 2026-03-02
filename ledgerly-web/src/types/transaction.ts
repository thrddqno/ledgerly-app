import type { Category } from './category.ts'

export interface Transaction {
    id: string
    amount: number
    date: string
    notes: string
    walletId: string
    transferId?: string
    relatedTransactionId?: string
    transfer: boolean
    categoryResponse: Category
    isIncoming: boolean
    relatedWalletId: string
}

export interface TransactionRequest {
    categoryId: string
    notes: string
    amount: number
    date: string
}

export interface TransferRequest {
    sourceWalletId: string
    targetWalletId: string
    amount: number
    date: string
}

export interface UpdateTransferRequest {
    sourceWalletId: string
    targetWalletId: string
    amount: number
    date: string
}

export interface PaginatedTransactionResponse {
    data: Transaction[]
    page: number
    limit: number
    total: number
}

export interface CursorPagedTransactionResponse {
    data: Transaction[]
    pageSize: number
    nextCursor: string | null
    hasNext: boolean
}
