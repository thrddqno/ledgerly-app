import * as React from 'react'
import { useEffect, useState } from 'react'
import spending from '../../../assets/spending.svg'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../../context/AuthenticationContext.tsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface InputFieldProps {
    label?: string
    type?: string
    placeholder?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    children?: React.ReactNode
}

function InputField({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    children,
}: InputFieldProps) {
    return (
        <div className="mb-4">
            <label className="mb-2 block text-xs font-medium tracking-widest text-neutral-500 uppercase">
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full rounded border border-[#555A70] px-4 py-3 text-sm text-neutral-100 placeholder-[#555A70] transition-all duration-200 outline-none focus:border-emerald-500 focus:ring-emerald-500/10"
                />
                {children}
            </div>
        </div>
    )
}

const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

function validatePassword(password: string) {
    return passwordRequirements.every((req) => req.test(password))
        ? ''
        : 'Password does not meet requirements'
}

export default function AuthPage() {
    const [mode, setMode] = useState('login')
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
    const [serverError, setServerError] = useState('')
    const { login, register, isLoading, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [passwordError, setPasswordError] = useState('')

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, isLoading, navigate])

    const isLogin = mode === 'login'
    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [key]: e.target.value }))
        if (key === 'password' && !isLogin) {
            setPasswordError(validatePassword(e.target.value))
        }
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        setServerError('')

        try {
            if (isLogin) {
                await login(form.email, form.password)
                navigate('/dashboard')
            } else {
                await register(form.firstName, form.lastName, form.email, form.password)
                navigate('/dashboard')
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setServerError(e.response?.data?.message ?? 'Something went wrong.')
            } else {
                setServerError('Something went wrong.')
            }
        }
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#0F1117] font-sans">
            {/* LEFT PANE — hidden below md breakpoint */}
            <div className="relative hidden flex-1 flex-col justify-end overflow-hidden p-12 md:flex">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s] hover:scale-105"
                    style={{
                        backgroundImage: `url(${spending})`,
                        filter: 'saturate(0.65) brightness(0.5)',
                    }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0F1117] via-[#0F1117]/20 to-transparent" />

                <div className="relative z-10">
                    <p className="mb-3 text-sm font-medium tracking-[0.15em] text-white uppercase">
                        One dashboard for all your wallets
                    </p>
                    <h1 className="text-5xl leading-tight font-black text-white xl:text-6xl">
                        Know Where
                        <br />
                        Your <span className="text-emerald-400">Money</span>
                        <br />
                        Goes
                    </h1>
                </div>
            </div>

            {/* Right Pane */}
            <div className="flex flex-1 flex-col items-center justify-center bg-[#0F1117] px-6 py-12 md:px-12">
                <div className="w-full max-w-sm">
                    {/* Heading */}
                    <h2 className="mb-3 text-center text-3xl font-bold text-neutral-100 md:text-4xl">
                        {isLogin ? (
                            <>
                                Welcome to <span className="text-emerald-400">Ledgerly </span>{' '}
                            </>
                        ) : (
                            'Create an Account'
                        )}
                    </h2>

                    {/* State prompt */}
                    <p className="mb-8 text-center text-sm text-[#8B90A7]">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => {
                                        setMode('register')
                                        setForm({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            password: '',
                                        })
                                        setServerError('')
                                    }}
                                    className="cursor-pointer font-bold text-emerald-400 hover:underline"
                                >
                                    Create an Account
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => {
                                        setMode('login')
                                        setForm({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            password: '',
                                        })
                                        setServerError('')
                                    }}
                                    className="cursor-pointer font-bold text-emerald-400 hover:underline"
                                >
                                    Log in
                                </button>
                            </>
                        )}
                    </p>

                    {/* Form fields */}
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="flex gap-3">
                                <InputField
                                    placeholder="First Name"
                                    value={form.firstName}
                                    onChange={set('firstName')}
                                    children={undefined}
                                />
                                <InputField
                                    placeholder="Last Name"
                                    value={form.lastName}
                                    onChange={set('lastName')}
                                    children={undefined}
                                />
                            </div>
                        )}

                        <InputField
                            type="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={set('email')}
                            children={undefined}
                        />

                        <InputField
                            type={showPass ? 'text' : 'password'}
                            placeholder="Password"
                            value={form.password}
                            onChange={set('password')}
                        >
                            <button
                                type="button"
                                onClick={() => setShowPass((p) => !p)}
                                className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300"
                            >
                                {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                        </InputField>

                        {!isLogin && form.password && passwordError && (
                            <ul className="mb-4 space-y-1">
                                {passwordRequirements.map((req) => {
                                    const passed = req.test(form.password)
                                    return (
                                        <li
                                            key={req.label}
                                            className={`flex items-center gap-2 text-xs ${passed ? 'text-emerald-400' : 'text-red-400'}`}
                                        >
                                            <span>{passed ? '✓' : '○'}</span>
                                            {req.label}
                                        </li>
                                    )
                                })}
                            </ul>
                        )}

                        {serverError && (
                            <p className="m-3 text-center text-sm text-red-400">{serverError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={
                                isLogin
                                    ? !form.email || !form.password
                                    : !form.firstName ||
                                      !form.lastName ||
                                      !form.email ||
                                      !form.password ||
                                      !!validatePassword(form.password)
                            }
                            className="mt-2 w-full rounded-lg bg-emerald-500 py-3 font-bold tracking-wide text-neutral-50 transition-all duration-200 hover:cursor-pointer hover:bg-emerald-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-emerald-500/30 disabled:text-emerald-100/40"
                        >
                            {isLogin ? 'Log In' : 'Create Account'}
                        </button>
                    </form>

                    {isLogin && (
                        <div className="flex w-full justify-center">
                            <button className="mt-5 text-center text-sm text-[#555A70] transition-colors hover:cursor-pointer hover:text-neutral-300">
                                Forgot Password?
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
