import { createContext, useContext, useEffect, useState } from 'react'
import {getMe, loginRequest, logoutRequest, registerRequest} from '../api/auth'

interface AuthenticationContext {
    isAuthenticated: boolean
    isLoading: boolean
    logout: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthenticationContext>({
    isAuthenticated: false,
    isLoading: true,
    logout: async () => {},
    login: async () => {},
    register: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getMe()
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false))
            .finally(() => setIsLoading(false))
    }, [])

    async function register(firstName: string, lastName: string, email: string, password: string) {
        await registerRequest({ firstName, lastName, email, password })
        setIsAuthenticated(true)
    }

    async function logout() {
        await logoutRequest()
        setIsAuthenticated(false)
    }

    async function login(email: string, password: string) {
        await loginRequest({ email, password })
        setIsAuthenticated(true)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, logout, login, register }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}