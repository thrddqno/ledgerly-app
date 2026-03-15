import type { ReactNode } from 'react'

interface InputFieldProps {
    type?: string
    placeholder?: string
    children?: ReactNode
    error?: string
}

export function InputField({
    type = 'text',
    placeholder,
    children,
    error,
    ...registerProps
}: InputFieldProps) {
    return (
        <div className="mb-4">
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    className={`border-base-content/40 placeholder-base-content/40 text-base-content w-full rounded-field border px-4 py-3 text-sm transition-all duration-200 outline-none focus:border-accent ${
                        error ? 'border-error focus:border-error' : ''
                    }`}
                    {...registerProps}
                />
                {children}
            </div>
            {error && <span className="text-error text-sm mt-1">{error}</span>}
        </div>
    )
}
