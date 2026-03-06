import { type BackdropType, useBackdrop } from '../context/BackdropContext.tsx'
import * as React from 'react'
import { useMemo, useRef, useState } from 'react'

export function useBackdropToggle(type: BackdropType, onBackdropClick?: () => void) {
    const { show, hide } = useBackdrop()
    const [isOpen, setIsOpen] = useState(false)

    const backdropId = useRef<number | null>(null)

    const close = React.useCallback(() => {
        setIsOpen(false)

        if (backdropId.current !== null) {
            hide(backdropId.current)
            backdropId.current = null
        }
    }, [hide])

    const open = React.useCallback(() => {
        setIsOpen(true)

        backdropId.current = show(type, () => {
            onBackdropClick?.()
            setIsOpen(false)

            if (backdropId.current !== null) {
                hide(backdropId.current)
                backdropId.current = null
            }
        })
    }, [show, type, onBackdropClick, hide])

    return useMemo(
        () => ({
            open,
            close,
            isOpen,
        }),
        [open, close, isOpen]
    )
}
