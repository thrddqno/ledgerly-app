import { useEffect } from 'react'

interface UseInfiniteScrollOptions {
    threshold?: number
}

export function useInfiniteScroll(
    onLoadMore: (() => void) | undefined,
    isLoading: boolean,
    scrollContainerRef: React.RefObject<HTMLDivElement>,
    options: UseInfiniteScrollOptions = {}
) {
    const { threshold = 0.1 } = options

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container || !onLoadMore) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    onLoadMore()
                }
            },
            { threshold, root: container } // root: container makes it relative to the scroll area
        )

        // Create a sentinel element dynamically
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
