import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthenticationContext'
import AuthLayout from '../../../components/layout/AuthenticationLayout'
import axios from 'axios'
import * as React from "react";

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login, isLoading, isAuthenticated } = useAuth()
    const [errors, setErrors] = useState({ email: '', password: '' })

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, isLoading, navigate])

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setErrors(prev => ({ ...prev, [name]: value.trim() ? '' : `${name === 'email' ? 'Email' : 'Password'} is required` }))
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        setError('')

        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? 'Something went wrong. Try again.')
            } else {
                setError('Something went wrong. Try again.')
            }
        }
    }

    return (
        <AuthLayout>
            <div className="bg-white p-8 w-full max-w-md shadow-md rounded-xl">
                <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-bold text-black mb-6">Login</h1>
                    <h1 className="text-2xl text-black mb-6">to Ledgerly</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onBlur={handleBlur}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 text-black rounded-xl px-4 py-3 text-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onBlur={handleBlur}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 text-black rounded-xl px-4 py-3 text-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                            placeholder="Password"
                        />
                        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/auth/register" className="text-blue-500 hover:underline">Register</Link>
                    </p>

                    <button
                        type="submit"
                        disabled={!email || !password}
                        className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:active:scale-100 text-white font-semibold py-3 rounded-xl text-sm tracking-wide transition-all duration-150 shadow-md shadow-blue-500/20 disabled:bg-gray-300 disabled:shadow-none disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </AuthLayout>
    )
}