import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthenticationContext'
import { validatePassword } from '../utils/passwordValidation'

export function useAuthForm() {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
    const [serverError, setServerError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const { login, register } = useAuth()
    const navigate = useNavigate()

    const isLogin = mode === 'login'

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [key]: e.target.value }))
        if (key === 'password' && !isLogin) {
            setPasswordError(validatePassword(e.target.value))
        }
    }

    function switchMode(next: 'login' | 'register') {
        setMode(next)
        setForm({ firstName: '', lastName: '', email: '', password: '' })
        setServerError('')
        setPasswordError('')
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        setServerError('')
        try {
            if (isLogin) {
                await login(form.email, form.password)
            } else {
                await register(form.firstName, form.lastName, form.email, form.password)
            }
            navigate('/dashboard')
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setServerError(e.response?.data?.message ?? 'Something went wrong.')
            } else {
                setServerError('Something went wrong.')
            }
        }
    }

    const isSubmitDisabled = isLogin
        ? !form.email || !form.password
        : !form.firstName ||
          !form.lastName ||
          !form.email ||
          !form.password ||
          !!validatePassword(form.password)

    return {
        isLogin,
        form,
        showPass,
        serverError,
        passwordError,
        set,
        switchMode,
        handleSubmit,
        isSubmitDisabled,
        setShowPass,
    }
}
