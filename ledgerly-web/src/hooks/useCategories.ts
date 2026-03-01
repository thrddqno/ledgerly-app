import { useEffect, useState } from 'react'
import {
    getCategories,
    createCategory as createCategoryRequest,
    updateCategory as updateCategoryRequest,
    deleteCategory as deleteCategoryRequest,
    deleteCategoryAndMove as deleteCategoryAndMoveRequest,
    mergeCategories as mergeCategoriesRequest,
} from '../api/category.ts'
import { useAuth } from '../context/AuthenticationContext.tsx'
import type {
    CategoriesGrouped,
    Category,
    CreateCategoryRequest,
    MergeCategoriesRequest,
    UpdateCategoryRequest,
} from '../types/category.ts'

export function useCategories() {
    const [categories, setCategories] = useState<CategoriesGrouped>({
        income: [],
        expenses: [],
        transfer: [],
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const { user } = useAuth()

    async function fetchCategories() {
        setIsLoading(true)
        try {
            const data = await getCategories()
            setCategories(data)
        } catch {
            setError('Failed to load categories.')
        } finally {
            setIsLoading(false)
        }
    }

    async function createCategory(data: CreateCategoryRequest) {
        const created = await createCategoryRequest(data)
        setCategories((prev) => ({
            ...prev,
            [groupKey(created.transactionType)]: [
                ...prev[groupKey(created.transactionType)],
                created,
            ],
        }))
    }

    async function updateCategory(id: string, data: UpdateCategoryRequest) {
        const updated = await updateCategoryRequest(id, data)
        setCategories((prev) => mapReplace(prev, id, updated))
    }

    async function deleteCategory(id: string) {
        await deleteCategoryRequest(id)
        setCategories((prev) => mapRemove(prev, id))
    }

    async function deleteCategoryAndMove(id: string, targetId: string) {
        await deleteCategoryAndMoveRequest(id, targetId)
        setCategories((prev) => mapRemove(prev, id))
    }

    async function mergeCategories(data: MergeCategoriesRequest) {
        const result = await mergeCategoriesRequest(data)
        setCategories((prev) => {
            let next = prev
            data.mergingCategoryIds.forEach((id) => {
                next = mapRemove(next, id)
            })
            return mapReplace(next, result.id, result)
        })
    }

    useEffect(() => {
        if (!user) return
        void fetchCategories()
    }, [user])

    const allCategories: Category[] = [
        ...categories.income,
        ...categories.expenses,
        ...categories.transfer,
    ]

    return {
        categories,
        allCategories,
        isLoading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
        deleteCategoryAndMove,
        mergeCategories,
    }
}

type GroupKey = 'income' | 'expenses' | 'transfer'

function groupKey(type: string): GroupKey {
    if (type === 'INCOME') return 'income'
    if (type === 'EXPENSE') return 'expenses'
    return 'transfer'
}

function mapReplace(prev: CategoriesGrouped, id: string, updated: Category): CategoriesGrouped {
    const key = groupKey(updated.transactionType)
    return {
        ...prev,
        [key]: prev[key].map((c) => (c.id === id ? updated : c)),
    }
}

function mapRemove(prev: CategoriesGrouped, id: string): CategoriesGrouped {
    return {
        income: prev.income.filter((c) => c.id !== id),
        expenses: prev.expenses.filter((c) => c.id !== id),
        transfer: prev.transfer.filter((c) => c.id !== id),
    }
}
