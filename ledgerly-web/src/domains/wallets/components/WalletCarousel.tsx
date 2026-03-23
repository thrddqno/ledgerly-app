import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useOverflowDetector } from '../../../shared/ui/hooks/useDetectOverflow.ts'
import { useWallets } from '../hooks/useWallets.ts'
import WalletCard from './WalletCard.tsx'

export function WalletCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
    })
    const [canScrollNext, setCanScrollNext] = useState(false)
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const { data: wallets, isLoading } = useWallets()
    const { ref, overflow } = useOverflowDetector({})

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => {
            setCanScrollPrev(emblaApi.canScrollPrev())
            setCanScrollNext(emblaApi.canScrollNext())
        }
        emblaApi.on('select', onSelect)
        onSelect()
    }, [emblaApi])

    const scroll = (direction: 'prev' | 'next') => {
        if (direction === 'prev') emblaApi?.scrollPrev()
        else emblaApi?.scrollNext()
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="flex flex-col py-5">
            <span className="text-base-content/50 pb-2 uppercase font-bold text-xs">
                Wallets
            </span>
            <div className="group relative ">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div ref={ref} className="flex gap-2">
                        {wallets?.map((wallet) => (
                            <div key={wallet.id} className="flex-[0_0_230px]">
                                <WalletCard wallet={wallet} />
                            </div>
                        ))}
                        {!overflow && (
                            <div
                                className={
                                    'flex flex-col h-25 gap-1 text-accent font-semibold text-md'
                                }
                            >
                                <button className="cursor-pointer hover:bg-base-100/10 bg-base-100 w-57.5 flex flex-row gap-2 justify-center items-center h-full border-base-300 border border-field transition-colors">
                                    <Plus className="w-5" />
                                    Add Wallet
                                </button>
                                <button className="cursor-pointer hover:bg-base-100/10 bg-base-100 w-57.5 h-full border-base-300 border border-field transition-colors">
                                    Manage Wallets
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Left Button - Overlay on left side */}
                {canScrollPrev && (
                    <button
                        onClick={() => scroll('prev')}
                        className="group/icon absolute left-0 top-1/2 -translate-y-1/2 scale-0 cursor-pointer group-hover:scale-100 h-full w-10 text-base-content hover:bg-base-300/60 rounded-field p-2 disabled:cursor-not-allowed transition-colors z-3"
                    >
                        <ChevronLeft className="group-hover/icon:scale-140 transition-transform" />
                    </button>
                )}

                {/* Right Button - Overlay on right side */}
                {canScrollNext && (
                    <button
                        onClick={() => scroll('next')}
                        className="group/icon absolute right-0 top-1/2 -translate-y-1/2 scale-0 cursor-pointer group-hover:scale-100 h-full w-10 text-base-content hover:bg-base-300/60 rounded-field p-2 disabled:cursor-not-allowed transition-colors z-3"
                    >
                        <ChevronRight className="group-hover/icon:scale-140 transition-transform" />
                    </button>
                )}
            </div>
            {overflow && (
                <div
                    className={
                        'flex flex-row h-12.5 gap-2 pt-2 text-accent font-semibold text-md'
                    }
                >
                    <button className="cursor-pointer hover:bg-base-100/10 bg-base-100 w-57.5 flex flex-row gap-2 justify-center items-center h-full border-base-300 border border-field transition-colors">
                        <Plus className="w-5" />
                        Add Wallet
                    </button>
                    <button className="cursor-pointer hover:bg-base-100/10 bg-base-100 w-57.5 h-full border-base-300 border border-field transition-colors">
                        Manage Wallets
                    </button>
                </div>
            )}
        </div>
    )
}
