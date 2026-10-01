import { onWatcherCleanup, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';

// Reactive size of ONE element (not the window): container-query-like logic in JS.
export function useElementSize(target: MaybeRefOrGetter<Element | null>) {
  const width = shallowRef(0);
  const height = shallowRef(0);

  watch(() => toValue(target), (el) => {
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry?.contentBoxSize[0]; // an array: one box per fragment
      if (!box) return;
      // shallowRef ignores same-value writes, so an unchanged size triggers no render.
      width.value = box.inlineSize; // inline/block = width/height in horizontal writing modes
      height.value = box.blockSize;
    });
    observer.observe(el); // fires once right away with the current size
    onWatcherCleanup(() => observer.disconnect());
  }, { immediate: true, flush: 'post' });

  return { width, height };
}
