import type { Category } from '../../categories/types/category.ts'

export interface Transaction {
    id: string
    notes?: string
    amount: number
    categoryResponse: Category
    date: string
    walletId: string
    transferId?: string
    relatedTransactionId?: string
    relatedWalletId?: string
    isIncoming: boolean
    transfer: boolean
}

export interface TransactionRequest {
    categoryId: string
    notes?: string
    amount: number
    date: string
}

export type UpdateTransactionRequest = TransactionRequest

export interface TransferRequest {
    sourceWalletId: string
    targetWalletId: string
    notes?: string
    amount: number
    date: string
}

export type UpdateTransferRequest = TransferRequest

export interface OffsetPagedTransactionResponse {
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
