import { readonly, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';

/** Content-box size of an element, kept in sync by a ResizeObserver. */
export function useElementSize(target: MaybeRefOrGetter<Element | null | undefined>) {
  const width = shallowRef(0);
  const height = shallowRef(0);

  if (typeof ResizeObserver !== 'undefined') {
    watch(() => toValue(target), (el, _prev, onCleanup) => {
      if (!el) return;
      const ro = new ResizeObserver(([entry]) => {
        if (!entry) return;
        width.value = entry.contentRect.width;
        height.value = entry.contentRect.height;
      });
      ro.observe(el);
      onCleanup(() => ro.disconnect());
    }, { immediate: true, flush: 'post' });
  }

  // Two refs, not reactive({ width, height }): callers can destructure.
  return { width: readonly(width), height: readonly(height) };
}
