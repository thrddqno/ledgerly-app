import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
    title: string
    onClose: () => void
    children: React.ReactNode
    maxWidth?: string
}

export default function Modal({ title, onClose, children, maxWidth = 'max-w-sm' }: Props) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true))
    }, [])

    function handleClose() {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                className={`fixed inset-0 z-40 bg-black/50 backdrop-brightness-75 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Modal */}
            <div
                className={`bg-surface border-border fixed top-1/2 left-1/2 z-50 w-full ${maxWidth} -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-2xl transition-all duration-200 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-text-primary text-lg font-bold">{title}</h2>
                    <button
                        onClick={handleClose}
                        className="text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                {children}
            </div>
        </>
    )
}
