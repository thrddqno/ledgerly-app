import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, loginRequest, logoutRequest, registerRequest } from '../api/auth'

interface User {
    id: number
    firstName: string
    lastName: string
    email: string
}

interface AuthenticationContext {
    isAuthenticated: boolean
    isLoading: boolean
    user: User | null
    logout: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => Promise<void>
}

const AuthContext = createContext<AuthenticationContext>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    logout: async () => {},
    login: async () => {},
    register: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        getMe()
            .then((data) => {
                setIsAuthenticated(true)
                setUser(data)
            })
            .catch(() => {
                setIsAuthenticated(false)
                setUser(null)
            })
            .finally(() => setIsLoading(false))
    }, [])

    async function register(firstName: string, lastName: string, email: string, password: string) {
        await registerRequest({ firstName, lastName, email, password })
        const data = await getMe()
        setIsAuthenticated(true)
        setUser(data)
    }

    async function logout() {
        await logoutRequest()
        setIsAuthenticated(false)
        setUser(null)
    }

    async function login(email: string, password: string) {
        await loginRequest({ email, password })
        const data = await getMe()
        setIsAuthenticated(true)
        setUser(data)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout, login, register }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}
