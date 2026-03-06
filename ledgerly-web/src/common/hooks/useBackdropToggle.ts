import { type BackdropType, useBackdrop } from '../context/BackdropContext.tsx'
import * as React from 'react'

export function useBackdropToggle(type: BackdropType) {
    const [isOpen, setIsOpen] = React.useState(false)
    const { show, hide, isVisible } = useBackdrop() // isVisible tells us if anything is open
    const activeId = React.useRef<number | null>(null)

    // Sync local state with global backdrop visibility
    // If the global backdrop is cleared (e.g., via clearAll), reset this hook
    React.useEffect(() => {
        if (!isVisible && isOpen) {
            setIsOpen(false)
            activeId.current = null
        }
    }, [isVisible, isOpen])

    const close = React.useCallback(() => {
        if (activeId.current !== null) {
            hide(activeId.current)
            activeId.current = null
        }
        setIsOpen(false)
    }, [hide])

    const open = React.useCallback(() => {
        if (isOpen) return
        const id = show(type, close)
        activeId.current = id
        setIsOpen(true)
    }, [show, type, close, isOpen])

    return { isOpen, open, close }
}
