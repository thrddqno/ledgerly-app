import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
})

let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = []

function processQueue(error: unknown) {
    failedQueue.forEach((p) => {
        if (error) {
            p.reject(error)
        } else {
            p.resolve(null)
        }
    })
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401) {
            return Promise.reject(error)
        }

        if (originalRequest.url?.includes('/auth')) {
            return Promise.reject(error)
        }

        if (originalRequest._retry) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'))
            return Promise.reject(error)
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            await api.post('/auth/refresh')
            processQueue(null)
            return api(originalRequest) // Retry original request
        } catch (refreshError) {
            processQueue(refreshError)
            window.dispatchEvent(new CustomEvent('auth:unauthorized'))
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }
)

export default api
