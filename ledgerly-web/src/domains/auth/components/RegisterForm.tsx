import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store/authStore.ts'
import { registerSchema, type RegisterFormData } from '../types/authSchema.ts'
import { passwordRequirements } from '../util/passwordValidation.ts'
import { InputField } from './InputField.tsx'

export function RegisterForm() {
    const { register: registerStore, isLoading, error } = useAuthStore()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    })

    const password = watch('password')

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerStore(
                data.firstName,
                data.lastName,
                data.email,
                data.password
            )
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-3">
                <InputField
                    {...register('firstName')}
                    placeholder="First Name"
                    error={errors.firstName?.message}
                />
                <InputField
                    {...register('lastName')}
                    placeholder="Last Name"
                    error={errors.lastName?.message}
                />
            </div>
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
            {password && errors.password && (
                <div className="mb-4 space-y-1">
                    {passwordRequirements.map((req) => {
                        const passed = req.test(password)
                        return (
                            <li
                                key={req.label}
                                className={`flex items-center gap-2 text-xs ${
                                    passed ? 'text-success' : 'text-error'
                                }`}
                            >
                                {passed ? <Check size={14} /> : <X size={14} />}
                                {req.label}
                            </li>
                        )
                    })}
                </div>
            )}
            <InputField
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                error={errors.confirmPassword?.message}
            >
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-base-content/40 hover:text-base-content absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                >
                    {showConfirmPassword ? (
                        <Eye size={16} />
                    ) : (
                        <EyeOff size={16} />
                    )}
                </button>
            </InputField>

            {error && (
                <p className="text-error mb-4 text-center text-sm">{error}</p>
            )}

            <button
                type="submit"
                className="text-accent-content bg-accent hover:bg-accent-hover disabled:bg-accent/30 disabled:text-accent/40 mt-2 w-full rounded-field py-3 font-bold tracking-wide transition-all duration-200 hover:cursor-pointer active:scale-[0.99] disabled:cursor-not-allowed"
            >
                Create Account
            </button>
        </form>
    )
}
