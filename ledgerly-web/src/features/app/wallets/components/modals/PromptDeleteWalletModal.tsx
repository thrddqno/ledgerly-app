
import { useState } from 'react'
import Modal from '../../../../../common/components/modals/Modal.tsx'
import type { Wallet } from '../../types/wallet.ts'
import { useWallets } from '../../hooks/useWallets.ts'
import * as React from 'react'

interface Props {
    onClose: () => void
    wallet: Wallet
}

export function PromptDeleteWalletModal({ onClose, wallet }: Props) {
    const [error, setError] = useState('')
    const { deleteWallet } = useWallets()

    function handleDelete(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation()
        try {
            deleteWallet(wallet.id)
            onClose()
        } catch {
            setError('Failed to delete wallet.')
        }
    }

    return (
        <Modal title={`Do you want to delete ${wallet.name}?`} onClose={onClose}>
            <div className="flex flex-col gap-4">
                {error && <p className="text-expense text-center text-sm">{error}</p>}

                <div className="mt-2 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border-border text-text-secondary hover:text-text-primary flex-1 cursor-pointer rounded-lg border py-3 text-sm font-medium transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-danger flex-1 cursor-pointer rounded-lg py-3 text-sm font-bold text-white transition-all hover:brightness-75"
                    >
                        Delete {wallet.name}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
