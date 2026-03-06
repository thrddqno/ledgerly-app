import { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react'

interface BackdropContextType {
    show: (type: BackdropType, onClickHandler?: () => void) => number
    hide: (id: number) => void
    isVisible: boolean
}

export type BackdropType = 'dropdown' | 'modal' | 'sidebar' | 'tooltip'

const Z_INDEX = {
    dropdown: 10,
    modal: 30,
    sidebar: 20,
    tooltip: 40,
}

interface BackdropLayer {
    id: number //fucking add id so modal can hide
    type: BackdropType
    onClickHandler?: () => void
}

const BackdropContext = createContext<BackdropContextType | null>(null)

export function BackdropProvider({ children }: { children: React.ReactNode }) {
    const [stack, setStack] = useState<BackdropLayer[]>([])
    const idRef = useRef(0)
    const isVisible = stack.length > 0
    const activeLayer = stack[stack.length - 1]
    const activeZIndex: number = activeLayer ? Z_INDEX[activeLayer.type] : 0

    const show = useCallback((type: BackdropType, onClickHandler?: () => void) => {
        const id = idRef.current++

        setStack((prev) => {
            const newStack = [...prev, { id, type, onClickHandler }]
            console.log('After show:', newStack)
            return newStack
        })

        return id
    }, [])

    const hide = useCallback((id: number) => {
        setStack((prev) => {
            const newStack = prev.filter((layer) => layer.id !== id)
            console.log('After hide:', newStack)
            return newStack
        })
    }, [])

    const value = useMemo(() => ({ show, hide, isVisible }), [show, hide, isVisible])

    return (
        <BackdropContext.Provider value={value}>
            {children}

            <div
                onClick={activeLayer?.onClickHandler}
                style={{ zIndex: activeZIndex }}
                className={`fixed inset-0 bg-black/40 backdrop-brightness-50 transition-all duration-100 ease-out ${
                    isVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
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
