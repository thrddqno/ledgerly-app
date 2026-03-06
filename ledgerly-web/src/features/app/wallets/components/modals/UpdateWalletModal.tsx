import Modal from '../../../../../common/components/modals/Modal.tsx'
import { useCallback, useEffect, useState } from 'react'
import { useWallets } from '../../hooks/useWallets.ts'
import type { Wallet } from '../../types/wallet.ts'
import { useModal } from '../../../../../common/context/ModalContext.tsx'

interface Props {
    onClose: () => void
    wallet: Wallet
}

export function UpdateWalletModal({ onClose, wallet }: Props) {
    const [form, setForm] = useState({ name: '', startingBalance: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const { updateWallet } = useWallets()
    const { openModal } = useModal()

    const handleDelete = useCallback(() => {
        openModal({ type: 'deleteWallet', payload: wallet })
    }, [openModal, wallet])

    useEffect(() => {
        setForm({
            name: wallet.name,
            startingBalance: wallet.startingBalance.toString(),
        })
    }, [wallet])

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((p) => ({ ...p, [key]: e.target.value }))

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')
        try {
            updateWallet({
                id: wallet.id,
                data: {
                    name: form.name,
                    startingBalance: parseFloat(form.startingBalance) || 0,
                },
            })
            onClose()
        } catch {
            setError('Failed to update wallets.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal title={`Update "${wallet.name}"`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-text-muted mb-2 block text-xs font-medium tracking-widest uppercase">
                        Wallet Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Savings"
                        value={form.name}
                        onChange={set('name')}
                        className="border-border bg-base text-text-primary placeholder-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none"
                    />
                </div>
                <div>
                    <label className="text-text-muted mb-2 block text-xs font-medium tracking-widest uppercase">
                        Starting Balance
                    </label>
                    <div className="relative">
                        <span className="text-text-muted absolute top-1/2 left-4 -translate-y-1/2 text-sm">
                            ₱
                        </span>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={form.startingBalance}
                            onChange={set('startingBalance')}
                            className="border-border bg-base text-text-primary placeholder-text-muted focus:border-accent w-full rounded-lg border py-3 pr-4 pl-8 text-sm transition-all outline-none"
                        />
                    </div>
                </div>

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
                        type="submit"
                        disabled={!form.name || isSubmitting}
                        className="bg-accent hover:bg-accent-hover flex-1 rounded-lg py-3 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Wallet'}
                    </button>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="text-danger text-xs underline"
                >
                    Delete Wallet
                </button>
            </form>
        </Modal>
    )
}
