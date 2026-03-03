import { useEffect, useState } from 'react'

export function useTheme() {
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    function toggleTheme() {
        setTheme((p) => (p === 'dark' ? 'light' : 'dark'))
    }

    return { theme, toggleTheme }
}
