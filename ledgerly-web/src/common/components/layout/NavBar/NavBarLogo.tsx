import { useNavigate } from 'react-router-dom'
import { useBackdrop } from '../../../context/BackdropContext.tsx'

export default function NavBarLogo() {
    const navigate = useNavigate()
    const { clearAll } = useBackdrop()

    return (
        <button
            className="flex cursor-pointer flex-col items-center justify-center p-2"
            onClick={() => {
                clearAll()
                navigate('/dashboard')
            }}
        >
            <span className="text-accent text-3xl font-extrabold">Ledgerly</span>

            <span className="text-text-primary text-[0.6rem] font-extrabold">
                Personal Finance Coach
            </span>
        </button>
    )
}
