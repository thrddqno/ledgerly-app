//device context thanks to https://github.com/redube/useDevice

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

const breakpoints = [
    { name: 'miniphone', min: 0, max: 320 },
    { name: 'phone', min: 320, max: 640 },
    { name: 'tablet', min: 640, max: 1080 },
    { name: 'desktop', min: 1080, max: Infinity },
] as const

type BreakpointName = (typeof breakpoints)[number]['name']

interface DeviceContextType {
    breakpoint: BreakpointName
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export function DeviceProvider({ children }: { children: ReactNode }) {
    const [width, setWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const activeBreakpoint =
        breakpoints.find((b) => width >= b.min && width < b.max)?.name ?? 'desktop'

    const value = {
        breakpoint: activeBreakpoint,
    }

    return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
}

export function useDevice() {
    const context = useContext(DeviceContext)
    if (!context) throw new Error('useDevice must be used within DeviceContext')
    return context
}
