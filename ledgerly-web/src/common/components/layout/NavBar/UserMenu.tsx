import { useAuth } from '../../../context/AuthenticationContext.tsx'

import { useTheme } from '../../../hooks/useTheme.ts'
import { useModal } from '../../../context/ModalContext.tsx'
import { ChevronDown, CreditCard, LogOut, Moon, Settings, Sun, User } from 'lucide-react'

interface Props {
    onToggle: () => void
    isOpen: boolean
}

export default function UserMenu({ onToggle, isOpen }: Props) {
    const { theme, toggleTheme } = useTheme()
    const { user } = useAuth()
    const { openModal } = useModal()

    return (
        <>
            <div className="my-4 mr-4 flex items-center justify-between pl-5">
                <button
                    className="flex cursor-pointer items-center gap-2.5 outline-none"
                    onClick={onToggle}
                >
                    <span className="bg-accent flex h-8 w-8 items-center justify-center rounded-full">
                        <User size={20} />
                    </span>
                    <span className="text-text-primary text-[13px] font-semibold">
                        {user?.firstName}
                    </span>
                    <ChevronDown
                        className={`text-text-muted/50 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            <div
                className={`bg-surface absolute top-full right-2 z-60 mt-2 w-48 origin-top-right rounded-sm py-1 font-semibold shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out ${
                    isOpen
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-2 opacity-0'
                }`}
            >
                <button className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm">
                    <Settings size={16} /> Account Settings
                </button>
                <button className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm">
                    <CreditCard size={16} /> Billing
                </button>
                <button
                    onClick={() => {
                        toggleTheme()
                        onToggle()
                    }}
                    className="text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm"
                >
                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />} Theme
                </button>
                <button
                    onClick={() => {
                        openModal({ type: 'logout' })
                        onToggle()
                    }}
                    className="border-border text-danger flex w-full cursor-pointer items-center gap-2 border-t px-4 py-2 text-sm hover:text-red-700"
                >
                    <LogOut size={16} /> Sign out
                </button>
            </div>
        </>
    )
}
