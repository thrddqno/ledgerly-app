import { useEffect } from 'react'
import * as React from 'react'

interface UseInfiniteScrollOptions {
    threshold?: number
}

export function useInfiniteScroll(
    onLoadMore: (() => void) | undefined,
    isLoading: boolean | undefined,
    scrollContainerRef: React.RefObject<HTMLDivElement | null>,
    options: UseInfiniteScrollOptions = {}
) {
    const { threshold = 1 } = options

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container || !onLoadMore) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    onLoadMore()
                }
            },
            { threshold, root: container }
        )

        const sentinel = document.createElement('div')
        sentinel.className = 'h-0'
        container.appendChild(sentinel)
        observer.observe(sentinel)

        return () => {
            observer.unobserve(sentinel)
            observer.disconnect()
            sentinel.remove()
        }
    }, [isLoading, onLoadMore, scrollContainerRef, threshold])
}
