import { readonly, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';

type MaybeEl = Element | null | undefined;

export function useIntersectionObserver(
  target: MaybeRefOrGetter<MaybeEl>,
  options: IntersectionObserverInit = {},
) {
  const isVisible = shallowRef(false);
  const isSupported = typeof IntersectionObserver !== 'undefined';

  if (isSupported) {
    watch(() => toValue(target), (el, _prev, onCleanup) => {
      if (!el) return;
      const io = new IntersectionObserver((entries) => {
        const last = entries.at(-1); // several may be batched; the last is current
        if (last) isVisible.value = last.isIntersecting;
      }, options);
      io.observe(el);
      onCleanup(() => io.disconnect()); // on target change AND scope dispose
    }, { immediate: true, flush: 'post' });
  }

  return { isVisible: readonly(isVisible), isSupported };
}
