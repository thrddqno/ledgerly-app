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
        if (error.name === 'AbortError' || error.name === 'CanceledError') {
            return Promise.reject(error)
        }

        const originalRequest = error.config

        const SKIP_REFRESH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh']
        if (SKIP_REFRESH_ENDPOINTS.some((endpoint) => originalRequest.url?.includes(endpoint))) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
            if (originalRequest._retry) {
                window.dispatchEvent(new CustomEvent('auth:unauthorized'))
                return Promise.reject(error)
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => api(originalRequest))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                await api.post('/auth/refresh')
                await new Promise((resolve) => setTimeout(resolve, 100))
                processQueue(null)
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError)
                window.dispatchEvent(new CustomEvent('auth:unauthorized'))
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }
        return Promise.reject(error)
    }
)

export default api
