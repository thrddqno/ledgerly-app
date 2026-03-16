import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAuthStore } from '../../../domains/auth/store/authStore.ts'
import { useDropdown } from '../../hooks/useDropdown.ts'
import { formatDate } from '../../utils/dateFormatter.ts'
import { CreateDropdown } from '../components/dropdowns/CreateDropdown.tsx'
import { UserMenuDropdown } from '../components/dropdowns/UserMenuDropdown.tsx'

function useDynamicGreeting() {
    const [greeting, setGreeting] = useState<string>('')

    useEffect(() => {
        const updateGreeting = () => {
            const hours = new Date().getHours()
            if (hours < 12) {
                setGreeting('Good Morning')
            } else if (hours < 18) {
                setGreeting('Good Afternoon')
            } else {
                setGreeting('Good Evening')
            }
        }

        updateGreeting()
        const interval = setInterval(updateGreeting, 3600000)
        return () => clearInterval(interval)
    }, [])

    return greeting
}

function useGetCurrentDate() {
    return formatDate(new Date().toISOString())
}

export default function NavBar() {
    const user = useAuthStore((state) => state.user)
    const greeting = useDynamicGreeting()
    const currentDate = useGetCurrentDate()
    const { toggle: toggleUserMenu } = useDropdown('userMenu')
    const { toggle: toggleCreate } = useDropdown('create')

    return (
        <div className="flex flex-row justify-between items-center py-5 border-b border-base-300">
            <div className="flex flex-col">
                <span className="font-bold text-neutral text-2xl">
                    {greeting}, {user?.firstName}!
                </span>
                <span className="text-base-content/60 text-md">
                    {currentDate}
                </span>
            </div>

            {/* Left Panel */}
            <div className="flex flex-row items-center gap-5">
                <button
                    onClick={toggleCreate}
                    className="flex hover:bg-accent hover:text-accent-content cursor-pointer transition-all flex-row items-center justify-center gap-1 text-sm font-bold px-4 py-1.5 border-accent border-2 text-accent rounded-3xl "
                >
                    <Plus size={18} />
                    Create
                </button>
                <CreateDropdown />
                <button
                    onClick={toggleUserMenu}
                    className="cursor-pointer transition-all hover:bg-neutral/20 flex flex-row items-center justify-center text-neutral border-neutral border text-sm w-9 h-9 rounded-4xl"
                >
                    {user
                        ? user?.firstName.charAt(0).toUpperCase() +
                          user?.lastName.charAt(0).toUpperCase()
                        : 'US'}
                </button>
                <UserMenuDropdown />
            </div>
        </div>
    )
}
