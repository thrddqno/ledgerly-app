import type { Category } from './category.ts'

export interface Transaction {
    id: string
    amount: number
    date: string
    isIncoming: boolean
    notes: string
    transactionType: 'INCOME' | 'EXPENSE'
    transferId: string
    relatedTransactionId: string
    walletId: string
    category: Category
}
