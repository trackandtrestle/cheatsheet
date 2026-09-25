import { useCallback, useEffectEvent } from 'react';

// Returns a callback ref for a sentinel element placed after the last item.
// When it comes within `rootMargin` of the viewport, `onLoadMore` fires.
export function useInfiniteScroll(onLoadMore: () => void, { enabled = true, rootMargin = '200px' } = {}) {
  const loadMore = useEffectEvent(onLoadMore); // always the latest closure

  return useCallback(
    (sentinel: HTMLElement | null) => {
      if (!sentinel || !enabled) return;
      const observer = new IntersectionObserver(
        (entries) => { if (entries.some((e) => e.isIntersecting)) loadMore(); },
        { rootMargin },
      );
      observer.observe(sentinel);
      return () => observer.disconnect(); // React 19: callback refs may return a cleanup
    },
    // New deps -> new ref callback -> React runs the cleanup and re-attaches.
    [enabled, rootMargin],
  );
}
