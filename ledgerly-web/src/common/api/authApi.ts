import api from './axios.ts'

export async function getMe(signal?: AbortSignal) {
    const response = await api.get('/user/me', { signal })
    return response.data
}

export async function loginRequest(
    data: { email: string; password: string },
    signal?: AbortSignal
) {
    const response = await api.post('/auth/login', data, { signal })
    return response.data
}

export async function registerRequest(
    data: { firstName: string; lastName: string; email: string; password: string },
    signal?: AbortSignal
) {
    const response = await api.post('/auth/register', data, { signal })
    return response.data
}

export async function logoutRequest(signal?: AbortSignal) {
    const response = await api.post('/auth/logout', {}, { signal })
    return response.data
}
