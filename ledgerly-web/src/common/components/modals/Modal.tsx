import { X } from 'lucide-react'
import * as React from 'react'
import { useEffect } from 'react'
import { useBackdropToggle } from '../../hooks/useBackdropToggle.ts'

interface Props {
    title: string
    onClose: () => void
    children: React.ReactNode
    maxWidth?: string
}

export default function Modal({ title, onClose, children, maxWidth }: Props) {
    const modal = useBackdropToggle('modal', onClose)

    const handleClose = () => {
        modal.close()
        onClose()
    }

    useEffect(() => {
        modal.open()
        console.log('i fire')
        return () => {
            console.log('i return')
            modal.close()
        }
    }, [])

    return (
        <div
            className={`bg-surface border-border fixed top-1/2 left-1/2 z-60 w-full -translate-x-1/2 ${
                maxWidth || 'max-w-sm'
            } -translate-y-1/2 rounded-2xl border p-6 shadow-2xl transition-all duration-200 ease-out ${
                modal.isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
        >
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-text-primary text-lg font-bold">{title}</h2>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleClose()
                    }}
                    className="text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {children}
        </div>
    )
}
