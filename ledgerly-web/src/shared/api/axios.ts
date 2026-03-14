/*
resources:
https://axios-http.com/docs/interceptors
https://jwt.io/introduction
 */
import axios from 'axios'

//note: once deployed, change this with the host url
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
})

/*  token refresh queue pattern
 *  prevents multiple refresh calls simultaneously
 */
let isRefreshing = false
let failedQueue: {
    resolve: (value: unknown) => void
    reject: (reason?: unknown) => void
}[] = []

/*
process all queued request after token refresh completes
if refresh succeeds, resolves all queued request to retry.
else, reject.
 */

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
        // skip when network error
        if (error.name === 'AbortError' || error.name === 'CanceledError') {
            return Promise.reject(error)
        }

        const originalRequest = error.config
        console.log('Error.config:' + error.config)

        //generally just skips these endpoints inorder to prevent infinite loops
        const SKIP_REFRESH_ENDPOINTS = [
            '/auth/login',
            '/auth/register',
            '/auth/refresh',
        ]

        if (
            SKIP_REFRESH_ENDPOINTS.some((endpoint) =>
                originalRequest.url?.includes(endpoint)
            )
        ) {
            return Promise.reject(error)
        }

        //handle 401
        if (error.response?.status === 401) {
            //if request alr retried, reject to avoid loops
            if (originalRequest._retry) {
                window.dispatchEvent(new CustomEvent('auth:unauthorized'))
                return Promise.reject(error)
            }

            // if refreshing, queue the request and wait
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => api(originalRequest)) // then retry with new token once done refreshing
            }

            // mark as retry attempt and start refresh
            originalRequest._retry = true
            isRefreshing = true

            try {
                await api.post('/auth/refresh')

                //todo: test if the delay is necessary or not.
                await new Promise((resolve) => setTimeout(resolve, 100))

                //resolve all queued requests so they fire with new token
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
