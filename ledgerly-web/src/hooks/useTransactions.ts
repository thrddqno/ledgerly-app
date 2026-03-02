import { useState } from 'react'
import {
    getTransactions,
    getTransactionsByWallet,
    createTransaction as createTransactionRequest,
    updateTransaction as updateTransactionRequest,
    deleteTransaction as deleteTransactionRequest,
    createTransfer as createTransferRequest,
    updateTransfer as updateTransferRequest,
    deleteTransfer as deleteTransferRequest,
} from '../api/transaction.ts'
import type {
    Transaction,
    TransactionRequest,
    TransferRequest,
    UpdateTransferRequest,
    CursorPagedTransactionResponse,
} from '../types/transaction.ts'

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [hasNext, setHasNext] = useState(false)

    function applyPage(page: CursorPagedTransactionResponse, reset: boolean) {
        setTransactions((prev) => {
            const incoming = reset ? page.data : [...prev, ...page.data]
            const seen = new Set<string>()
            return incoming.filter((tx) => {
                if (seen.has(tx.id)) return false
                seen.add(tx.id)
                return true
            })
        })
        setNextCursor(page.nextCursor)
        setHasNext(page.hasNext)
    }

    async function fetchTransactions(
        params?: {
            cursor?: string
            startDate?: string
            endDate?: string
            size?: number
        },
        reset = true
    ) {
        setIsLoading(true)
        try {
            const data = await getTransactions(params)
            applyPage(data, reset)
        } catch {
            setError('Failed to load transactions.')
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchTransactionsByWallet(
        walletId: string,
        params?: {
            cursor?: string
            startDate?: string
            endDate?: string
            size?: number
        },
        reset = true
    ) {
        setIsLoading(true)
        try {
            const data = await getTransactionsByWallet(walletId, params)
            applyPage(data, reset)
        } catch {
            setError('Failed to load transactions.')
        } finally {
            setIsLoading(false)
        }
    }

    async function loadMore(
        walletId?: string,
        params?: {
            startDate?: string
            endDate?: string
            size?: number
        }
    ) {
        if (!hasNext || !nextCursor || isLoading) return
        const cursor = nextCursor
        if (walletId) {
            await fetchTransactionsByWallet(walletId, { ...params, cursor }, false)
        } else {
            await fetchTransactions({ ...params, cursor }, false)
        }
    }

    async function createTransaction(walletId: string, body: TransactionRequest) {
        const created = await createTransactionRequest(walletId, body)
        setTransactions((prev) => [created, ...prev])
    }

    async function updateTransaction(
        walletId: string,
        transactionId: string,
        body: TransactionRequest
    ) {
        const updated = await updateTransactionRequest(walletId, transactionId, body)
        setTransactions((prev) => prev.map((t) => (t.id === transactionId ? updated : t)))
    }

    async function deleteTransaction(walletId: string, transactionId: string) {
        await deleteTransactionRequest(walletId, transactionId)
        setTransactions((prev) => prev.filter((t) => t.id !== transactionId))
    }

    async function createTransfer(body: TransferRequest) {
        const created = await createTransferRequest(body)
        setTransactions((prev) => [...created, ...prev])
    }

    async function updateTransfer(transferId: string, body: UpdateTransferRequest) {
        const updated = await updateTransferRequest(transferId, body)
        setTransactions((prev) => prev.map((t) => updated.find((u) => u.id === t.id) ?? t))
    }

    async function deleteTransfer(transferId: string) {
        await deleteTransferRequest(transferId)
        setTransactions((prev) => prev.filter((t) => t.transferId !== transferId))
    }

    return {
        transactions,
        isLoading,
        error,
        nextCursor,
        hasNext,
        fetchTransactions,
        fetchTransactionsByWallet,
        loadMore,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        createTransfer,
        updateTransfer,
        deleteTransfer,
    }
}
