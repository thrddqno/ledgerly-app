import { createContext, useContext } from 'react'
import { useCategories as useCategoriesHook } from '../hooks/useCategories.ts'
import type {
    CategoriesGrouped,
    Category,
    CreateCategoryRequest,
    MergeCategoriesRequest,
    UpdateCategoryRequest,
} from '../types/category.ts'

interface CategoryContextType {
    categories: CategoriesGrouped
    allCategories: Category[]
    isLoading: boolean
    error: string
    createCategory: (data: CreateCategoryRequest) => Promise<void>
    updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<void>
    deleteCategory: (id: string) => Promise<void>
    deleteCategoryAndMove: (id: string, targetId: string) => Promise<void>
    mergeCategories: (data: MergeCategoriesRequest) => Promise<void>
}

const CategoryContext = createContext<CategoryContextType | null>(null)

export function CategoryProvider({ children }: { children: React.ReactNode }) {
    const categoryState = useCategoriesHook()

    return <CategoryContext.Provider value={categoryState}>{children}</CategoryContext.Provider>
}

export function useCategories() {
    const ctx = useContext(CategoryContext)
    if (!ctx) throw new Error('useCategories must be used inside CategoryProvider')
    return ctx
}
