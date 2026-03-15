import { LogOut, Moon, Settings, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../../../domains/auth/store/authStore.ts'
import {
    useDropdown,
    useDropdownClickOutside,
} from '../../../hooks/useDropdown.ts'
import { useThemeStore } from '../../../stores/themeStore.ts'

export function UserMenuDropdown() {
    const { isOpen, close } = useDropdown('userMenu')
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()
    const { toggleTheme, theme } = useThemeStore()
    const dropdownRef = useDropdownClickOutside(close)

    if (!isOpen) return null

    const userMenuButtons = [
        { icon: Settings, label: 'Settings', function: () => {} },
        {
            icon: theme === 'dark' ? Moon : Sun,
            label: 'Theme',
            function: toggleTheme,
        },
        {
            icon: LogOut,
            label: 'Sign out',
            function: async () => {
                await handleLogout()
            },
        },
    ]

    const handleLogout = async () => {
        await logout()
        close()
        navigate('/auth')
    }

    return (
        <div
            ref={dropdownRef}
            className="absolute py-2 top-22 right-2 bg-base-100 border border-base-300 rounded-field mt-1 w-64 z-10 transition-all"
        >
            <div className="flex flex-row px-4 py-5 border-b border-base-300 gap-3">
                <button className="cursor-default transition-all flex flex-row items-center justify-center text-neutral border-neutral border text-sm w-9 h-9 rounded-4xl">
                    {user
                        ? user?.firstName.charAt(0).toUpperCase() +
                          user?.lastName.charAt(0).toUpperCase()
                        : 'US'}
                </button>
                <div className="flex flex-col">
                    <span className="text-md font-medium">
                        {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-[0.7rem] text-base-content/50">
                        {user?.email}
                    </span>
                </div>
            </div>
            <div className="pt-2">
                {userMenuButtons.map((button) => {
                    return (
                        <button
                            key={button.label}
                            onClick={button.function}
                            className="flex flex-row gap-3 items-center text-base-content text-md px-5 cursor-pointer hover:bg-base-300 w-full py-2 transition-all"
                        >
                            <button.icon size={20} />
                            {button.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
