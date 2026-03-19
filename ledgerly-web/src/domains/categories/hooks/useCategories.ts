import {
    useMutation,
    type UseMutationResult,
    useQuery,
    useQueryClient,
    type UseQueryResult,
} from '@tanstack/react-query'

import { TransactionType } from '../../transactions/types/transactionType.ts'
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategory,
    getCategoryByType,
    mergeCategories,
    moveAndDeleteCategory,
    updateCategory,
} from '../api/category.ts'
import type {
    Category,
    CreateCategoryRequest,
    MergeCategoriesRequest,
    UpdateCategoryRequest,
} from '../types/category.ts'

export function useCategories(): UseQueryResult<Category[]> {
    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getAllCategories,
    })
}

export function useCategoryByType(
    type: TransactionType
): UseQueryResult<Category[]> {
    return useQuery<Category[]>({
        queryKey: ['category', 'type', type],
        queryFn: () => getCategoryByType(type),
        enabled: !!type,
    })
}

export function useCategory(id: string): UseQueryResult<Category> {
    return useQuery({
        queryKey: ['category', id],
        queryFn: () => getCategory(id),
        enabled: !!id,
    })
}

export function useCreateCategory(): UseMutationResult<
    Category,
    Error,
    CreateCategoryRequest
> {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCategory,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

export function useUpdateCategory(): UseMutationResult<
    Category,
    Error,
    { id: string; data: UpdateCategoryRequest }
> {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => updateCategory(id, data),
        onSuccess: async (updatedCategory) => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] })
            await queryClient.invalidateQueries({
                queryKey: ['category', updatedCategory.id],
            })
        },
    })
}

export function useMergeCategories(): UseMutationResult<
    Category,
    Error,
    MergeCategoriesRequest
> {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: mergeCategories,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

export function useMoveAndDeleteCategory(): UseMutationResult<
    void,
    Error,
    { id: string; target: string }
> {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, target }) => moveAndDeleteCategory(id, target),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}

export function useDeleteCategory(): UseMutationResult<void, Error, string> {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
    })
}
