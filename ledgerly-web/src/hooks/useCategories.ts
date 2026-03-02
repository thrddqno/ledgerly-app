import {
    getCategories,
    createCategory as createCategoryRequest,
    updateCategory as updateCategoryRequest,
    deleteCategory as deleteCategoryRequest,
    deleteCategoryAndMove as deleteCategoryAndMoveRequest,
    mergeCategories as mergeCategoriesRequest,
} from '../api/category.ts'
import { useAuth } from '../context/AuthenticationContext.tsx'
import type { Category, UpdateCategoryRequest } from '../types/category.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useCategories() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    const {
        data: categories = { income: [], expenses: [], transfer: [] },
        isLoading,
        error,
    } = useQuery({
        queryKey: ['categories', user?.id],
        queryFn: getCategories,
        enabled: !!user,
    })

    const allCategories: Category[] = [
        ...categories.income,
        ...categories.expenses,
        ...categories.transfer,
    ]

    const createCategoryMutation = useMutation({
        mutationFn: createCategoryRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })

    const updateCategoryMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
            updateCategoryRequest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })

    const deleteCategoryMutation = useMutation({
        mutationFn: (id: string) => deleteCategoryRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })

    const deleteCategoryAndMoveMutation = useMutation({
        mutationFn: ({ id, targetId }: { id: string; targetId: string }) =>
            deleteCategoryAndMoveRequest(id, targetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['transactions'] }) // Also refetch transactions
        },
    })

    const mergeCategoriesMutation = useMutation({
        mutationFn: mergeCategoriesRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })

    return {
        allCategories: categories,
        categories,
        isLoading,
        error: error?.message ?? '',
        createCategory: createCategoryMutation.mutate,
        updateCategory: updateCategoryMutation.mutate,
        deleteCategory: deleteCategoryMutation.mutate,
        deleteCategoryAndMove: deleteCategoryAndMoveMutation.mutate,
        mergeCategories: mergeCategoriesMutation.mutate,
    }
}

type GroupKey = 'income' | 'expenses' | 'transfer'

function groupKey(type: string): GroupKey {
    if (type === 'INCOME') return 'income'
    if (type === 'EXPENSE') return 'expenses'
    return 'transfer'
}
