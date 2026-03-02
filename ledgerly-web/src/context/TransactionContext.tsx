// context/TransactionContext.tsx
import { createContext, useContext } from 'react'
import { useTransactions as useTransactionsHook } from '../hooks/useTransactions.ts'
import type {
    Transaction,
    TransactionRequest,
    TransferRequest,
    UpdateTransferRequest,
} from '../types/transaction.ts'

interface TransactionContextType {
    transactions: Transaction[]
    isLoading: boolean
    error: string
    nextCursor: string | null
    hasNext: boolean
    fetchTransactions: (
        params?: {
            cursor?: string
            startDate?: string
            endDate?: string
            size?: number
        },
        reset?: boolean
    ) => Promise<void>
    fetchTransactionsByWallet: (
        walletId: string,
        params?: {
            cursor?: string
            startDate?: string
            endDate?: string
            size?: number
        },
        reset?: boolean
    ) => Promise<void>
    loadMore: (
        walletId?: string,
        params?: {
            startDate?: string
            endDate?: string
            size?: number
        }
    ) => Promise<void>
    createTransaction: (walletId: string, body: TransactionRequest) => Promise<void>
    updateTransaction: (
        walletId: string,
        transactionId: string,
        body: TransactionRequest
    ) => Promise<void>
    deleteTransaction: (walletId: string, transactionId: string) => Promise<void>
    createTransfer: (body: TransferRequest) => Promise<void>
    updateTransfer: (transferId: string, body: UpdateTransferRequest) => Promise<void>
    deleteTransfer: (transferId: string) => Promise<void>
}

const TransactionContext = createContext<TransactionContextType | null>(null)

export function TransactionProvider({ children }: { children: React.ReactNode }) {
    const transactionState = useTransactionsHook()

    return (
        <TransactionContext.Provider value={transactionState}>
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransactions() {
    const ctx = useContext(TransactionContext)
    if (!ctx) throw new Error('useTransactions must be used inside TransactionProvider')
    return ctx
}
