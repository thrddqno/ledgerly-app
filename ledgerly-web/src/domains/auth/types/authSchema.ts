import { z } from 'zod'

import { validatePassword } from '../util/passwordValidation.ts'

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password required'),
})

export const registerSchema = z
    .object({
        firstName: z.string().min(1, 'First name required'),
        lastName: z.string().min(1, 'Last name required'),
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .refine(
                (password) => validatePassword(password) === '',
                'Password does not meet requirements'
            ),
        confirmPassword: z.string(),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                path: ['confirmPassword'],
                message: 'Passwords do not match',
            })
        }
    })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
