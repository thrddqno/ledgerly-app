import { BadgeDollarSignIcon, House, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const navItems = [
    { icon: House, label: 'Your Ledger', path: '/home' },
    { icon: BadgeDollarSignIcon, label: 'Transactions', path: '/transactions' },
    { icon: Pencil, label: 'Manage', path: '/' },
]

//todo: finish sidebar
export default function SideBar() {
    const navigate = useNavigate()

    return (
        <div className="bg-base-200 border-base-300 border-r h-screen w-65 shrink-0 flex flex-col px-4 py-6">
            <button className=" flex mb-9 flex-col item-center justify-center p-2 font-extrabold cursor-pointer">
                <span className="text-3xl text-accent">Ledgerly</span>
                <span className="text-base-content/80 -translate-y-0.75 text-[0.70rem]">
                    Personal Finance Coach
                </span>
            </button>

            <nav className="flex flex-col gap-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all 
                            ${isActive ? 'bg-accent/10 text-accent font-semibold' : 'text-base-content'}`}
                        >
                            <item.icon
                                size={16}
                                className={` ${isActive ? 'text-accent' : 'text-base-content/40'}`}
                            />
                            {item.label}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
