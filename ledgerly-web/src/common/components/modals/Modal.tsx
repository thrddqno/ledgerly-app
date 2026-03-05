import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useBackdrop } from '../../context/BackdropContext.tsx'

interface Props {
    title: string
    onClose: () => void
    children: React.ReactNode
    maxWidth?: string
}

export default function Modal({ title, onClose, children, maxWidth }: Props) {
    const [visible, setVisible] = useState(false)
    const { show, hide } = useBackdrop()

    useEffect(() => {
        show()
        requestAnimationFrame(() => setVisible(true))

        return () => {
            hide()
        }
    }, [show, hide])

    function handleClose() {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    return (
        <div
            className={`bg-surface border-border fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 ${
                maxWidth || 'max-w-sm'
            } -translate-y-1/2 rounded-2xl border p-6 shadow-2xl transition-all duration-200 ease-out ${
                visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
        >
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-text-primary text-lg font-bold">{title}</h2>
                <button
                    onClick={handleClose}
                    className="text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {children}
        </div>
    )
}
