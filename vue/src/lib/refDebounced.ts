import { customRef, onScopeDispose, watch, type Ref } from 'vue';

export type DebouncedRef<T> = Readonly<Ref<T>> & { flush(): void };

/** A read-only ref that follows `source` after `wait` ms of quiet; `flush()` syncs immediately. */
export function refDebounced<T>(source: Ref<T>, wait: number): DebouncedRef<T> {
  let value = source.value;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let trigger = () => {};
  const out = customRef<T>((track, t) => {
    trigger = t;
    return { get: () => (track(), value), set: () => {} };
  });
  const sync = () => {
    clearTimeout(timer);
    value = source.value;
    trigger();
  };
  watch(source, () => {
    clearTimeout(timer);
    timer = setTimeout(sync, wait);
  });
  onScopeDispose(() => clearTimeout(timer));
  return Object.assign(out, { flush: sync });
}
