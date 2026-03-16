import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useWallets } from '../hooks/useWallets.ts'
import WalletCard from './WalletCard.tsx'

export function WalletCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
    })
    const [canScrollNext, setCanScrollNext] = useState(false)
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const { data: wallets, isLoading } = useWallets()

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
                    <div className="flex gap-2">
                        {wallets?.map((wallet) => (
                            <div key={wallet.id} className="flex-[0_0_230px]">
                                <WalletCard wallet={wallet} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Left Button - Overlay on left side */}
                <button
                    onClick={() => scroll('prev')}
                    disabled={!canScrollPrev}
                    className="cursor-pointer absolute top-1/2 left-2 -translate-y-1/2 scale-0 bg-primary/25 hover:bg-primary disabled:scale-0 group-hover:scale-100 text-primary-content rounded-full p-2 disabled:cursor-not-allowed transition-all z-10"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Right Button - Overlay on right side */}
                <button
                    onClick={() => scroll('next')}
                    disabled={!canScrollNext}
                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 scale-0 bg-primary/25 hover:bg-primary disabled:scale-0 group-hover:scale-100 text-primary-content rounded-full p-2 disabled:cursor-not-allowed transition-all z-10"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
            <div
                className={`flex ${
                    wallets?.length && wallets.length <= 1
                        ? 'flex-col h-25 gap-1 '
                        : 'flex-row h-12.5 gap-2'
                } pt-2  text-accent font-semibold text-md`}
            >
                <button className="cursor-pointer hover:bg-base-content/10 bg-base-100 w-57.5 flex flex-row gap-2 justify-center items-center h-full border-base-300 border border-field transition-all">
                    <Plus className="w-5" />
                    Add Wallet
                </button>
                <button className="cursor-pointer hover:bg-base-content/10 bg-base-100 w-57.5 h-full border-base-300 border border-field transition-all">
                    Manage Wallets
                </button>
            </div>
        </div>
    )
}
