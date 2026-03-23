import {
    useMutation,
    type UseMutationResult,
    useQuery,
    useQueryClient,
    type UseQueryResult,
} from '@tanstack/react-query'

import {
    createWallet,
    deleteWallet,
    getAllWallet,
    getWallet,
    reorderWallets,
    updateWallet,
} from '../api/wallet.ts'
import type { Wallet, WalletRequest } from '../types/wallet.ts'

export function useWallets(): UseQueryResult<Wallet[]> {
    return useQuery({ queryKey: ['wallets'], queryFn: getAllWallet })
}

export function useWallet(id?: string): UseQueryResult<Wallet> {
    return useQuery({
        queryKey: ['wallet', id],
        queryFn: () => getWallet(id!),
        enabled: !!id,
    })
}

export function useCreateWallet(): UseMutationResult<
    Wallet,
    Error,
    WalletRequest
> {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
        },
    })
}

export function useUpdateWallet(): UseMutationResult<
    Wallet,
    Error,
    { id: string; data: WalletRequest }
> {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => updateWallet(id, data),
        onSuccess: (updatedWallet) => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
            queryClient.invalidateQueries({
                queryKey: ['wallet', updatedWallet.id],
            })
        },
    })
}

export function useDeleteWallet(): UseMutationResult<void, Error, string> {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
        },
    })
}

export function useReorderWallets(): UseMutationResult<void, Error, string[]> {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: reorderWallets,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
        },
    })
}
