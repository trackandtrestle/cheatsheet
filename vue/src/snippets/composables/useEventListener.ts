import { toValue, watch, type MaybeRefOrGetter } from 'vue';

type EventMap = WindowEventMap & DocumentEventMap & HTMLElementEventMap;
type Target = EventTarget | null | undefined;

/**
 * Binds a listener to a target that may be a ref/getter (e.g. a template ref).
 * Re-binds when the target changes; removes it when the scope is disposed.
 * Returns a manual `stop`.
 */
export function useEventListener<K extends keyof EventMap>(
  target: MaybeRefOrGetter<Target>,
  type: K,
  handler: (event: EventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void {
  return watch(
    () => toValue(target),
    (el, _prev, onCleanup) => {
      if (!el) return;
      const listener = handler as EventListener;
      el.addEventListener(type, listener, options);
      onCleanup(() => el.removeEventListener(type, listener, options));
    },
    // 'post' so template refs are populated; the watcher stops (and runs
    // onCleanup) automatically when the owning component/scope is disposed.
    { immediate: true, flush: 'post' },
  );
}
