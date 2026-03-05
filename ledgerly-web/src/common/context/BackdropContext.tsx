import { createContext, useContext, useState, useMemo, useCallback } from 'react'

interface BackdropContextType {
    show: (onClickHandler?: () => void) => void
    hide: () => void
    isVisible: boolean
}

const BackdropContext = createContext<BackdropContextType | null>(null)

export function BackdropProvider({ children }: { children: React.ReactNode }) {
    const [count, setCount] = useState(0)
    const [clickHandler, setClickHandler] = useState<(() => void) | null>(null)
    const isVisible = count > 0

    const show = useCallback((onClickHandler?: () => void) => {
        setCount((prev) => prev + 1)
        if (onClickHandler) {
            setClickHandler(() => onClickHandler)
        }
    }, [])

    const hide = useCallback(() => {
        setCount((prev) => {
            const newCount = Math.max(0, prev - 1)
            if (newCount === 0) {
                setClickHandler(null)
            }
            return newCount
        })
    }, [])

    const value = useMemo(() => ({ show, hide, isVisible }), [show, hide, isVisible])

    return (
        <BackdropContext.Provider value={value}>
            {children}

            {/* Single shared backdrop */}
            <div
                onClick={clickHandler || undefined}
                className={`fixed inset-0 z-40 bg-black/40 backdrop-brightness-50 transition-all duration-100 ease-out ${
                    isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
            />
        </BackdropContext.Provider>
    )
}

export function useBackdrop() {
    const ctx = useContext(BackdropContext)
    if (!ctx) throw new Error('useBackdrop must be used inside BackdropProvider')
    return ctx
}
