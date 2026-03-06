import {
    createTransaction as createTransactionRequest,
    createTransfer as createTransferRequest,
    deleteTransaction as deleteTransactionRequest,
    deleteTransfer as deleteTransferRequest,
    getTransactions,
    getTransactionsByWallet,
    updateTransaction as updateTransactionRequest,
    updateTransfer as updateTransferRequest,
} from '../api/transactionApi.ts'
import type {
    TransactionRequest,
    TransferRequest,
    UpdateTransferRequest,
} from '../types/transaction.ts'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface RequestParameters {
    walletId?: string
    startDate?: string
    endDate?: string
    size?: number
}

export function useTransactions(options: RequestParameters = {}) {
    const { walletId, startDate, endDate, size } = options
    const queryClient = useQueryClient()

    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ['transactions', { walletId, startDate, endDate, size }],
            queryFn: ({ pageParam }) => {
                const params = {
                    cursor: pageParam,
                    startDate,
                    endDate,
                    size,
                }
                return walletId
                    ? getTransactionsByWallet(walletId, params)
                    : getTransactions(params)
            },
            getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
            initialPageParam: undefined as string | undefined,
        })

    const transactions = data?.pages.flatMap((page) => page.data) ?? []

    const createTransactionMutation = useMutation({
        mutationFn: ({ walletId, body }: { walletId: string; body: TransactionRequest }) =>
            createTransactionRequest(walletId, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    const updateTransactionMutation = useMutation({
        mutationFn: ({
            walletId,
            transactionId,
            body,
        }: {
            walletId: string
            transactionId: string
            body: TransactionRequest
        }) => updateTransactionRequest(walletId, transactionId, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    const deleteTransactionMutation = useMutation({
        mutationFn: ({ walletId, transactionId }: { walletId: string; transactionId: string }) =>
            deleteTransactionRequest(walletId, transactionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    const createTransferMutation = useMutation({
        mutationFn: (body: TransferRequest) => createTransferRequest(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    const updateTransferMutation = useMutation({
        mutationFn: ({ transferId, body }: { transferId: string; body: UpdateTransferRequest }) =>
            updateTransferRequest(transferId, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    const deleteTransferMutation = useMutation({
        mutationFn: (transferId: string) => deleteTransferRequest(transferId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    return {
        transactions,
        isLoading,
        error: error?.message ?? '',
        createTransaction: createTransactionMutation.mutate,
        updateTransaction: updateTransactionMutation.mutate,
        deleteTransaction: deleteTransactionMutation.mutate,
        createTransfer: createTransferMutation.mutate,
        updateTransfer: updateTransferMutation.mutate,
        deleteTransfer: deleteTransferMutation.mutate,
        hasMore: hasNextPage,
        isLoadingMore: isFetchingNextPage,
        loadMore: fetchNextPage,
    }
}
