import type { TransactionType } from './transactionType.ts'

export interface Category {
    id: string
    color: string
    icon: string
    name: string
    transactionType: TransactionType
}

export interface CreateCategoryRequest {
    color: string
    icon: string
    name: string
    transactionType: 'INCOME'
}

export interface UpdateCategoryRequest {
    color: string
    icon: string
    name: string
}

export interface MergeCategoriesRequest {
    mergingCategoryIds: string[]
    finalCategoryId: string
}

export interface CategoriesGrouped {
    income: Category[]
    expenses: Category[]
    transfer: Category[]
}
