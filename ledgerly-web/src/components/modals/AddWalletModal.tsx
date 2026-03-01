import Modal from '../common/Modal.tsx'
import { useState } from 'react'
import type { CreateWalletRequest, WalletDetail } from '../../api/wallet.ts'

interface Props {
    onClose: () => void
    onSubmit: (data: CreateWalletRequest) => Promise<void | WalletDetail>
}

export default function AddWalletModal({ onClose, onSubmit }: Props) {
    const [form, setForm] = useState({ name: '', startingBalance: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((p) => ({ ...p, [key]: e.target.value }))

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')
        try {
            await onSubmit({
                name: form.name,
                startingBalance: parseFloat(form.startingBalance) || 0,
            })
            onClose()
        } catch {
            setError('Failed to create wallet.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal title="New Wallet" onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-text-muted mb-2 block text-xs font-medium tracking-widest uppercase">
                        Wallet Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. BDO Savings"
                        value={form.name}
                        onChange={set('name')}
                        className="border-border bg-base text-text-primary placeholder-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="text-text-muted mb-2 block text-xs font-medium tracking-widest uppercase">
                        Starting Balance
                    </label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={form.startingBalance}
                        onChange={set('startingBalance')}
                        className="border-border bg-base text-text-primary placeholder-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none"
                    />
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
                        {isSubmitting ? 'Creating...' : 'Create Wallet'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
