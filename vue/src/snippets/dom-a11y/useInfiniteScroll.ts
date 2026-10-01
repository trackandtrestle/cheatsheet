import { onWatcherCleanup, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';

interface Options {
  enabled?: MaybeRefOrGetter<boolean>; // false when there are no more pages
  rootMargin?: string; // start loading before the sentinel is actually visible
}

// Calls `loadMore` whenever `sentinel` (an element after the last item) nears the viewport.
export function useInfiniteScroll(
  sentinel: MaybeRefOrGetter<Element | null>,
  loadMore: () => Promise<unknown>,
  { enabled = true, rootMargin = '200px' }: Options = {},
) {
  const loading = shallowRef(false);
  // Array of sources (not a getter returning an array) so unchanged values don't re-run it.
  watch([() => toValue(sentinel), () => toValue(enabled)], ([el, on]) => {
    if (!el || !on) return;
    let active = true;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry?.isIntersecting || loading.value) return;
      loading.value = true;
      try {
        await loadMore();
      } finally {
        loading.value = false;
        // Still visible after a short page? Re-observing fires the callback again.
        if (active) { observer.unobserve(el); observer.observe(el); }
      }
    }, { rootMargin });
    observer.observe(el);
    onWatcherCleanup(() => { active = false; observer.disconnect(); }); // sentinel/enabled changed, unmount
  }, { immediate: true, flush: 'post' });
  return { loading };
}
