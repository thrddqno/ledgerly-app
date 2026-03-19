import {
    type ModifiableTransactionType,
    type TransactionType,
} from '../../transactions/types/transactionType.ts'

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
    transactionType: ModifiableTransactionType
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
