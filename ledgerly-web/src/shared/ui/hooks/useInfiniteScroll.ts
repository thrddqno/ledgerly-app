import { useEffect } from 'react'
import * as React from 'react'

interface UseInfiniteScrollOptions {
    threshold?: number
}

export function useInfiniteScroll(
    onLoadMore: (() => void) | undefined,
    isLoading: boolean | undefined,
    sentinel: React.RefObject<HTMLDivElement | null>,
    options: UseInfiniteScrollOptions = {}
) {
    const { threshold = 0 } = options

    useEffect(() => {
        const container = sentinel.current
        if (!container || !onLoadMore) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    onLoadMore()
                }
            },
            { threshold, root: null, rootMargin: '0px 0px 50px 0px' }
        )

        /*
        const sentinel = document.createElement('div')
        sentinel.className = 'h-1'
        container.appendChild(sentinel)
        */
        observer.observe(container)

        return () => {
            observer.unobserve(container)
            observer.disconnect()
        }
    }, [isLoading, onLoadMore, sentinel, threshold])
}
