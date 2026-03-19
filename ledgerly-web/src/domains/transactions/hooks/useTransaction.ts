import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'

import {
    createTransaction as createTransactionApi,
    createTransfer as createTransferApi,
    getTransaction as getTransactionApi,
    getAllTransactions as getAllTransactionsApi,
    getAllTransactionsByWallet as getAllTransactionsByWalletApi,
    updateTransaction as updateTransactionApi,
    updateTransfer as updateTransferApi,
    deleteTransaction as deleteTransactionApi,
    deleteTransfer as deleteTransferApi,
} from '../api/transaction.ts'
import type {
    TransactionRequest,
    TransferRequest,
    UpdateTransactionRequest,
    UpdateTransferRequest,
} from '../types/transaction.ts'

interface Parameters {
    walletId?: string
    transactionId?: string
    startDate?: string
    endDate?: string
    size?: number
}

export function useTransactions({
    walletId,
    startDate,
    endDate,
    size,
}: Parameters = {}) {
    return useInfiniteQuery({
        queryKey: ['transactions', { walletId, startDate, endDate, size }],
        queryFn: ({ pageParam }) => {
            const params = {
                cursor: pageParam,
                startDate,
                endDate,
                size,
            }

            return walletId
                ? getAllTransactionsByWalletApi(walletId, params)
                : getAllTransactionsApi(params)
        },
        getNextPageParam: (lastPage) =>
            lastPage.hasNext ? lastPage.nextCursor : undefined,
        initialPageParam: undefined as string | undefined,
        select: (data) => ({
            ...data,
            flat: data.pages.flatMap((page) => page.data),
        }),
    })
}

export function useTransaction({
    walletId,
    transactionId,
}: {
    walletId: string
    transactionId: string
}) {
    return useQuery({
        queryKey: ['transaction', transactionId],
        queryFn: () => getTransactionApi(walletId, transactionId),
        enabled: !!walletId && !!transactionId,
    })
}

export function useCreateTransaction() {
    const invalidate = useInvalidateTransactions()

    return useMutation({
        mutationFn: ({
            walletId,
            body,
        }: {
            walletId: string
            body: TransactionRequest
        }) => createTransactionApi(walletId, body),

        onSuccess: invalidate,
    })
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient()
    const invalidate = useInvalidateTransactions()

    return useMutation({
        mutationFn: ({
            walletId,
            transactionId,
            body,
        }: {
            walletId: string
            transactionId: string
            body: UpdateTransactionRequest
        }) => updateTransactionApi(walletId, transactionId, body),

        onSuccess: async (updated) => {
            await invalidate()
            await queryClient.invalidateQueries({
                queryKey: ['transaction', updated.id],
            })
        },
    })
}

export function useDeleteTransaction() {
    const invalidate = useInvalidateTransactions()

    return useMutation({
        mutationFn: ({
            walletId,
            transactionId,
        }: {
            walletId: string
            transactionId: string
        }) => deleteTransactionApi(walletId, transactionId),

        onSuccess: invalidate,
    })
}

//transfers

export function useCreateTransfer() {
    const invalidate = useInvalidateTransactions()

    return useMutation({
        mutationFn: (body: TransferRequest) => createTransferApi(body),

        onSuccess: invalidate,
    })
}

export function useUpdateTransfer() {
    const queryClient = useQueryClient()
    const invalidate = useInvalidateTransactions()

    return useMutation({
        mutationFn: ({
            transferId,
            body,
        }: {
            transferId: string
            body: UpdateTransferRequest
        }) => updateTransferApi(transferId, body),

        onSuccess: async (updatedTransfer) => {
            await invalidate()

            if (Array.isArray(updatedTransfer)) {
                await Promise.all(
                    updatedTransfer.map((tx) =>
                        queryClient.invalidateQueries({
                            queryKey: ['transaction', tx.id],
                        })
                    )
                )
            }
        },
    })
}

export function useDeleteTransfer() {
    const invalidate = useInvalidateTransactions()

    return useMutation({
        mutationFn: (transferId: string) => deleteTransferApi(transferId),

        onSuccess: invalidate,
    })
}

// helper func to invalidate
function useInvalidateTransactions() {
    const queryClient = useQueryClient()

    return () =>
        queryClient.invalidateQueries({
            queryKey: ['transactions'],
        })
}
