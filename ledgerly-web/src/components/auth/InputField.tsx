import * as React from 'react'

interface InputFieldProps {
    type?: string
    placeholder?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    children?: React.ReactNode
}

export function InputField({
    type = 'text',
    placeholder,
    value,
    onChange,
    children,
}: InputFieldProps) {
    return (
        <div className="mb-4">
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="border-text-muted placeholder-text-muted w-full rounded border px-4 py-3 text-sm text-neutral-100 transition-all duration-200 outline-none focus:border-emerald-500"
                />
                {children}
            </div>
        </div>
    )
}
