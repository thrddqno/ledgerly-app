import { useAuth } from '../../context/AuthenticationContext.tsx'
import { useState } from 'react'
import Modal from './Modal.tsx'

interface Props {
    onClose: () => void
}

export function PromptLogoutModal({ onClose }: Props) {
    const { logout } = useAuth()
    const [error, setError] = useState('')

    async function handleLogout() {
        try {
            await logout()
            onClose()
        } catch {
            setError('Failed to logout.')
        }
    }

    return (
        <Modal title="Do you want to Logout?" onClose={onClose}>
            <div className="flex flex-col gap-4">
                {error && <p className="text-expense text-center text-sm">{error}</p>}

                <div className="mt-2 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border-border text-text-secondary hover:text-text-primary flex-1 rounded-lg border py-3 text-sm font-medium transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="bg-danger flex-1 rounded-lg py-3 text-sm font-bold text-white transition-all hover:brightness-75 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </Modal>
    )
}
