import Modal from '../../../../common/components/modals/Modal.tsx'

interface Props {
    onClose: () => void
}

export function AddTransactionModal({ onClose }: Props) {
    return (
        <Modal title={'test'} onClose={onClose} maxWidth={'max-w-3xl'}>
            <form onSubmit={() => {}} className="flex w-full flex-col gap-4">
                <div className="grid grid-cols-4 justify-center gap-2">
                    <div>
                        <label className="text-text-muted mb-2 block text-xs font-medium tracking-widest uppercase">
                            Category
                        </label>
                        <select className="border-border bg-base text-text-primary placeholder-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none" />
                    </div>
                    <div>
                        <label className="text-text-muted mb-2 block text-xs font-medium tracking-widest uppercase">
                            Date
                        </label>
                        <select className="border-border bg-base text-text-primary placeholder-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none" />
                    </div>
                    <div>
                        <label className="text-text-muted mb-2 block text-xs font-medium tracking-widest uppercase">
                            Notes
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Savings"
                            className="border-border bg-base text-text-primary placeholder-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-text-muted mb-2 block text-xs font-medium tracking-widest uppercase">
                            Amount
                        </label>
                        <input
                            type="text"
                            placeholder="0.00"
                            className="border-border bg-base text-text-primary placeholder-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-sm transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="flex flex-row">
                    <button
                        type="submit"
                        className="bg-accent hover:bg-accent-hover ml-auto w-48 rounded-lg py-3 text-sm font-bold text-white transition-all"
                    >
                        Create Wallet
                    </button>
                </div>
            </form>
        </Modal>
    )
}
