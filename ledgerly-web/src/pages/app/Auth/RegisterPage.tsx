import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthenticationContext'
import AuthLayout from '../../../components/layout/AuthenticationLayout'
import axios from 'axios'

const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

function validateField(name: string, value: string) {
    switch (name) {
        case 'firstName':
        case 'lastName':
            return value.trim() ? '' : `${name === 'firstName' ? 'First' : 'Last'} name is required`
        case 'email':
            if (!value) return 'Email is required'
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address'
        case 'password':
            if (!value) return 'Password is required'
            return passwordRequirements.every(req => req.test(value)) ? '' : 'Password does not meet requirements'
        default:
            return ''
    }
}

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '', password: '' })
    const [serverError, setServerError] = useState('')

    const navigate = useNavigate()
    const { register, isAuthenticated, isLoading } = useAuth()

    useEffect(() => {
        if (!isLoading && isAuthenticated) navigate('/dashboard')
    }, [isAuthenticated, isLoading, navigate])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        switch (name) {
            case 'firstName': setFirstName(value); break
            case 'lastName': setLastName(value); break
            case 'email': setEmail(value); break
            case 'password': setPassword(value); break
        }
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        setServerError('')

        const fields = { firstName, lastName, email, password }
        const newErrors = Object.fromEntries(
            Object.entries(fields).map(([k, v]) => [k, validateField(k, v)])
        )
        setErrors(newErrors as typeof errors)
        if (Object.values(newErrors).some(Boolean)) return

        try {
            await register(firstName, lastName, email, password)
            navigate('/dashboard')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setServerError(err.response?.data?.message ?? 'Something went wrong. Try again.')
            } else {
                setServerError('Something went wrong. Try again.')
            }
        }
    }

    const inputClass = (field: keyof typeof errors) =>
        `bg-gray-50 text-black rounded-xl px-4 py-3 text-sm ring-1 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
            errors[field] ? 'ring-red-400 focus:ring-red-500' : 'ring-gray-200 focus:ring-blue-500'
        }`

    return (
        <AuthLayout>
            <div className="bg-white p-8 w-full max-w-md shadow-md rounded-xl">
                <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-bold text-black mb-6">Create</h1>
                    <h1 className="text-2xl text-black mb-6">an account</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</label>
                        <input name="firstName" type="text" value={firstName} onChange={handleChange} className={inputClass('firstName')} placeholder="First Name" />
                        {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</label>
                        <input name="lastName" type="text" value={lastName} onChange={handleChange} className={inputClass('lastName')} placeholder="Last Name" />
                        {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                        <input name="email" type="email" value={email} onChange={handleChange} className={inputClass('email')} placeholder="you@example.com" />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Password</label>
                        <input name="password" type="password" value={password} onChange={handleChange} className={inputClass('password')} placeholder="Password" />
                        {password && errors.password && (
                            <ul className="flex flex-col gap-1 mt-1">
                                {passwordRequirements.map((req) => (
                                    <li key={req.label} className={`text-xs flex items-center gap-1.5 ${req.test(password) ? 'text-green-500' : 'text-red-400'}`}>
                                        <span>{req.test(password) ? '✓' : '✗'}</span>
                                        {req.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {serverError && <p className="text-sm text-red-500 text-center">{serverError}</p>}

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/" className="text-blue-500 hover:underline">Sign in</Link>
                    </p>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold py-3 rounded-xl text-sm tracking-wide transition-all duration-150 shadow-md shadow-blue-500/20"
                    >
                        Register
                    </button>
                </form>
            </div>
        </AuthLayout>
    )
}