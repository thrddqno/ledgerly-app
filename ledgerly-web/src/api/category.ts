// ── Endpoints ─────────────────────────────────────────────────────────────────

// GET /api/v1/categories — all categories grouped by type
import type {
    CategoriesGrouped,
    Category,
    CreateCategoryRequest,
    MergeCategoriesRequest,
    UpdateCategoryRequest,
} from '../types/category.ts'
import api from './axios.ts'
import type { TransactionType } from '../types/transactionType.ts'

export async function getCategories(): Promise<CategoriesGrouped> {
    const res = await api.get('/api/v1/categories')
    return res.data
}

// GET /api/v1/categories/:id
export async function getCategory(id: string): Promise<Category> {
    const res = await api.get(`/api/v1/categories/${id}`)
    return res.data
}

// GET /api/v1/categories/type/:transactionType
export async function getCategoriesByType(type: TransactionType): Promise<Category[]> {
    const res = await api.get(`/api/v1/categories/type/${type}`)
    return res.data
}

// POST /api/v1/categories
export async function createCategory(data: CreateCategoryRequest): Promise<Category> {
    const res = await api.post('/api/v1/categories', data)
    return res.data
}

// PUT /api/v1/categories/:id
export async function updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    const res = await api.put(`/api/v1/categories/${id}`, data)
    return res.data
}

// DELETE /api/v1/categories/:id
export async function deleteCategory(id: string): Promise<void> {
    await api.delete(`/api/v1/categories/${id}`)
}

// DELETE /api/v1/categories/:id/move/:targetId — delete and reassign transactions
export async function deleteCategoryAndMove(id: string, targetId: string): Promise<void> {
    await api.delete(`/api/v1/categories/${id}/move/${targetId}`)
}

// POST /api/v1/categories/merge
export async function mergeCategories(data: MergeCategoriesRequest): Promise<Category> {
    const res = await api.post('/api/v1/categories/merge', data)
    return res.data
}
