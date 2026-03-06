import {
    createWallet as createWalletRequest,
    deleteWallet as deleteWalletRequest,
    getWalletsDetailed,
    reorderWallets as reorderWalletRequest,
    updateWallet as updateWalletRequest,
} from '../api/walletApi.ts'
import type { WalletRequest } from '../types/wallet.ts'
import { useAuth } from '../../../../common/context/AuthenticationContext.tsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useWallets() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    const {
        data: wallets = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['wallets', user?.id],
        queryFn: getWalletsDetailed,
        enabled: !!user,
    })

    const createWalletMutation = useMutation({
        mutationFn: createWalletRequest,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
        },
    })

    const reorderWalletsMutation = useMutation({
        mutationFn: (walletIds: string[]) => reorderWalletRequest(walletIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
        },
    })

    const updateWalletMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: WalletRequest }) =>
            updateWalletRequest(id, data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
        },
    })

    const deleteWalletMutation = useMutation({
        mutationFn: deleteWalletRequest,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['wallets'] })
        },
    })
    const totalBalance = wallets.reduce((sum, w) => sum + w.startingBalance, 0)

    return {
        wallets,
        isLoading,
        error: error?.message ?? '',
        totalBalance,
        createWallet: createWalletMutation.mutateAsync,
        reorderWallets: reorderWalletsMutation.mutate,
        updateWallet: updateWalletMutation.mutate,
        deleteWallet: deleteWalletMutation.mutate,
    }
}
