import { useState, useRef } from 'react'
import WalletCard from './WalletCard.tsx'
import { useWallets } from '../../context/WalletContext.tsx'
import { PackageOpen } from 'lucide-react'
import type { Wallet } from '../../types/wallet.ts'
import { AddWalletModal } from '../modals/AddWalletModal.tsx'

interface Props {
    onWalletSelect?: (wallet: Wallet | null) => void
}

export default function WalletList({ onWalletSelect }: Props) {
    const { wallets } = useWallets()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)
    const MAX_WALLETS = 10

    const scrollRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true
        startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
        scrollLeft.current = scrollRef.current?.scrollLeft ?? 0
        if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing'
    }

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return
        e.preventDefault()
        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = x - startX.current
        scrollRef.current.scrollLeft = scrollLeft.current - walk
    }

    const onMouseUp = () => {
        isDragging.current = false
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
    }

    const [showLeftFade, setShowLeftFade] = useState(false)
    const [showRightFade, setShowRightFade] = useState(true)

    const onScroll = () => {
        const el = scrollRef.current
        if (!el) return
        setShowLeftFade(el.scrollLeft > 0)
        setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
    }

    const handleClick = (wallet: Wallet) => {
        const next = selectedId === wallet.id ? null : wallet.id
        setSelectedId(next)
        onWalletSelect?.(next ? wallet : null)
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-text-secondary text-xs font-semibold tracking-widest uppercase">
                    Wallets
                </span>
                {wallets.length < MAX_WALLETS && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="border-accent text-accent hover:bg-accent/10 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors duration-150"
                    >
                        + Add Wallet
                    </button>
                )}
            </div>

            {wallets.length === 0 ? (
                <div className="text-text-secondary border-border flex h-28 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm">
                    <PackageOpen className="h-6 opacity-40" />
                    <span className="opacity-60">No wallets yet</span>
                </div>
            ) : (
                <div className="relative">
                    <div
                        className={`from-base pointer-events-none absolute top-0 left-0 z-10 h-full w-20 bg-linear-to-r to-transparent transition-opacity duration-200 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <div
                        className={`from-base pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-linear-to-l to-transparent transition-opacity duration-200 ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
                    />

                    <div
                        ref={scrollRef}
                        className="flex cursor-grab flex-row gap-3 overflow-x-auto pb-1 select-none"
                        style={{ scrollbarWidth: 'none' }}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                        onScroll={onScroll}
                    >
                        {wallets.map((wallet) => (
                            <WalletCard
                                key={wallet.id}
                                wallet={wallet}
                                isSelected={selectedId === wallet.id}
                                onClick={handleClick}
                            />
                        ))}
                        <div className="w-4 flex-shrink-0" />
                    </div>
                </div>
            )}
            {showModal && <AddWalletModal onClose={() => setShowModal(false)} />}
        </div>
    )
}
