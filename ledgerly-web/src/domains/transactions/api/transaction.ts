import api from '../../../shared/api/axios.ts'
import type {
    CursorPagedTransactionResponse,
    Transaction,
    TransactionRequest,
    TransferRequest,
    UpdateTransactionRequest,
    UpdateTransferRequest,
} from '../types/transaction.ts'

export async function getAllTransactions(params?: {
    cursor?: string
    startDate?: string
    endDate?: string
    size?: number
}): Promise<CursorPagedTransactionResponse> {
    const response = await api.get('/api/v1/transactions/keyset', { params })
    return response.data
}

export async function getAllTransactionsByWallet(
    walletId: string,
    params?: {
        cursor?: string
        startDate?: string
        endDate?: string
        size?: number
    }
): Promise<CursorPagedTransactionResponse> {
    const response = await api.get(`/api/v1/transactions/${walletId}/keyset`, {
        params,
    })
    return response.data
}

export async function getTransaction(
    walletId: string,
    transactionId: string
): Promise<Transaction> {
    const response = await api.get(
        `/api/v1/transactions/${walletId}/${transactionId}`
    )
    return response.data
}

export async function createTransaction(
    walletId: string,
    data: TransactionRequest
): Promise<Transaction> {
    const response = await api.post(`/api/v1/transactions/${walletId}`, data)
    return response.data
}

export async function createTransfer(
    data: TransferRequest
): Promise<Transaction[]> {
    const response = await api.post(`/api/v1/transactions/transfer`, data)
    return response.data
}

export async function updateTransaction(
    walletId: string,
    transactionId: string,
    data: UpdateTransactionRequest
): Promise<Transaction> {
    const response = await api.put(
        `/api/v1/transactions/${walletId}/${transactionId}`,
        data
    )
    return response.data
}

export async function updateTransfer(
    transferId: string,
    data: UpdateTransferRequest
): Promise<Transaction[]> {
    const response = await api.put(
        `/api/v1/transactions/transfer/${transferId}`,
        data
    )
    return response.data
}

export async function deleteTransaction(
    walletId: string,
    transactionId: string
): Promise<void> {
    const response = await api.delete(
        `/api/v1/transactions/${walletId}/${transactionId}`
    )
    return response.data
}

export async function deleteTransfer(transferId: string): Promise<void> {
    const response = await api.delete(
        `/api/v1/transactions/transfer/${transferId}`
    )
    return response.data
}
