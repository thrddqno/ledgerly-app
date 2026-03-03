import api from '../../../../common/api/axios.ts'
import type {
    Transaction,
    TransactionRequest,
    TransferRequest,
    UpdateTransferRequest,
    PaginatedTransactionResponse,
    CursorPagedTransactionResponse,
} from '../types/transaction.ts'

export const getTransactions = (params?: {
    cursor?: string
    startDate?: string
    endDate?: string
    size?: number
}): Promise<CursorPagedTransactionResponse> => {
    return api.get('/api/v1/transactions/keyset', { params }).then((r) => r.data)
}

export const getTransactionsByWallet = (
    walletId: string,
    params?: {
        cursor?: string
        startDate?: string
        endDate?: string
        size?: number
    }
): Promise<CursorPagedTransactionResponse> => {
    return api.get(`/api/v1/transactions/${walletId}/keyset`, { params }).then((r) => r.data)
}

export const getTransactionsByWalletOffset = (
    walletId: string,
    params: {
        page: number
        size: number
    }
): Promise<PaginatedTransactionResponse> => {
    return api.get(`/api/v1/transactions/${walletId}`, { params }).then((r) => r.data)
}

export const getTransaction = (walletId: string, transactionId: string): Promise<Transaction> => {
    return api.get(`/api/v1/transactions/${walletId}/${transactionId}`).then((r) => r.data)
}

export const createTransaction = (
    walletId: string,
    body: TransactionRequest
): Promise<Transaction> => {
    return api.post(`/api/v1/transactions/${walletId}`, body).then((r) => r.data)
}

export const createTransfer = (body: TransferRequest): Promise<Transaction[]> => {
    return api.post('/api/v1/transactions/transfer', body).then((r) => r.data)
}

export const updateTransaction = (
    walletId: string,
    transactionId: string,
    body: TransactionRequest
): Promise<Transaction> => {
    return api.put(`/api/v1/transactions/${walletId}/${transactionId}`, body).then((r) => r.data)
}

export const updateTransfer = (
    transferId: string,
    body: UpdateTransferRequest
): Promise<Transaction[]> => {
    return api.put(`/api/v1/transactions/transfer/${transferId}`, body).then((r) => r.data)
}

export const deleteTransaction = (walletId: string, transactionId: string): Promise<void> => {
    return api.delete(`/api/v1/transactions/${walletId}/${transactionId}`).then((r) => r.data)
}

export const deleteTransfer = (transferId: string): Promise<void> => {
    return api.delete(`/api/v1/transactions/transfer/${transferId}`).then((r) => r.data)
}
