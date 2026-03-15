import { useEffect, useRef } from 'react'

import { useDropdownStore } from '../stores/dropdownStore.ts'

export function useDropdown(id: string) {
    const active = useDropdownStore((state) => state.active)
    const toggle = useDropdownStore((state) => state.toggle)
    const close = useDropdownStore((state) => state.close)

    return {
        isOpen: active === id,
        toggle: () => toggle(id),
        close: () => close(id),
    }
}

export function useDropdownClickOutside(callback: () => void) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [callback])

    return ref
}
