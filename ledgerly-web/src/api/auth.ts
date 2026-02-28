import api from './axios.ts'

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}

export async function registerRequest(data: RegisterRequest) {
    const response = await api.post('/auth/register', data)
    return response.data
}

export async function loginRequest(data: LoginRequest) {
    const response = await api.post('/auth/login', data)
    return response.data
}

export async function logoutRequest() {
    const response = await api.post('/auth/logout')
    return response.data
}

export async function getMe() {
    const response = await api.get('/api/v1/categories')
    return response.data
}