import { Pencil, Receipt, WalletCards } from 'lucide-react'

import {
    useDropdown,
    useDropdownClickOutside,
} from '../../../hooks/useDropdown.ts'

export function CreateDropdown() {
    const { isOpen, close } = useDropdown('create')
    const dropdownRef = useDropdownClickOutside(close)

    if (!isOpen) return null
    return (
        <div
            ref={dropdownRef}
            className="flex flex-col gap-2 absolute py-2 top-22 right-12 bg-base-100 border border-base-300 rounded-field mt-1 w-fit z-10 transition-all"
        >
            <button className="gap-4 cursor-pointer px-4 py-1.5 flex flex-row hover:bg-base-300 transition-all">
                <Receipt size={22} />
                Transactions
            </button>
            <button className="gap-4 cursor-pointer px-4 py-1.5 flex flex-row hover:bg-base-300 transition-all">
                <WalletCards size={22} />
                Wallets
            </button>
            <div className="pt-2 border-t border-base-300">
                <button className="gap-4 cursor-pointer px-4 py-1.5 flex w-full flex-row border-base-300 hover:bg-base-300 transition-all">
                    <Pencil size={22} />
                    Manage
                </button>
            </div>
        </div>
    )
}
