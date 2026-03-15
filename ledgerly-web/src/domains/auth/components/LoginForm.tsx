import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store/authStore.ts'
import {
    type LoginFormData,
    loginSchema,
    type RegisterFormData,
    registerSchema,
} from '../types/authSchema.ts'
import { InputField } from './InputField.tsx'

export function LoginForm() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const { login, error } = useAuthStore()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.password)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
                {...register('email')}
                type="email"
                placeholder="Email Address"
                error={errors.email?.message}
            />
            <InputField
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                error={errors.password?.message}
            >
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-base-content/40 hover:text-base-content absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
            </InputField>

            {error && (
                <p className="text-error mb-4 text-center text-sm">{error}</p>
            )}

            <button
                type="submit"
                className="text-accent-content bg-accent hover:bg-accent-hover disabled:bg-accent/30 disabled:text-accent/40 mt-2 w-full rounded-field py-3 font-bold tracking-wide transition-all duration-200 hover:cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed"
            >
                Sign in
            </button>
        </form>
    )
}
