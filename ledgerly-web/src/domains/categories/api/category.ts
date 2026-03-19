import api from '../../../shared/api/axios.ts'
import { TransactionType } from '../../transactions/types/transactionType.ts'
import type {
    Category,
    CreateCategoryRequest,
    MergeCategoriesRequest,
    UpdateCategoryRequest,
} from '../types/category.ts'

export async function getAllCategories(): Promise<Category[]> {
    const response = await api.get('/api/v1/categories')
    return response.data
}

export async function getCategoryByType(
    type: TransactionType
): Promise<Category[]> {
    const response = await api.get(`/api/v1/categories/type/${type}`)
    return response.data
}

export async function getCategory(id: string): Promise<Category> {
    const response = await api.get(`/api/v1/categories/${id}`)
    return response.data
}

// todo: delete the formatted response in the backend

export async function createCategory(
    data: CreateCategoryRequest
): Promise<Category> {
    const response = await api.post('/api/v1/categories', data)
    return response.data
}

export async function updateCategory(
    id: string,
    data: UpdateCategoryRequest
): Promise<Category> {
    const response = await api.put(`/api/v1/categories/${id}`, data)
    return response.data
}

export async function deleteCategory(id: string): Promise<void> {
    const response = await api.delete(`/api/v1/categories/${id}`)
    return response.data
}

export async function moveAndDeleteCategory(
    id: string,
    target: string
): Promise<void> {
    const response = await api.delete(`/api/v1/categories/${id}/move/${target}`)
    return response.data
}

export async function mergeCategories(
    data: MergeCategoriesRequest
): Promise<Category> {
    const response = await api.post('/api/v1/categories/merge', data)
    return response.data
}
