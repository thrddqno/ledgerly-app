import * as React from 'react'

interface InputFieldProps {
    label?: string
    type?: string
    placeholder?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    children?: React.ReactNode
}

export function InputField({
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
