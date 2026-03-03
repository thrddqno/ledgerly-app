import { createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'

interface UIContextType {
    activePage: string
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const activePage = location.pathname

    return (
        <UIContext.Provider
            value={{
                activePage,
            }}
        >
            {children}
        </UIContext.Provider>
    )
}

export const useUIContext = () => {
    const context = useContext(UIContext)
    if (!context) throw new Error('useUIContext must be used within UIContext')
    return context
}
