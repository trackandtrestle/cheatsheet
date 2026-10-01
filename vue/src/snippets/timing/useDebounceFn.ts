import { onScopeDispose } from 'vue';

export interface DebouncedFn<A extends unknown[]> {
  (...args: A): void;
  cancel: () => void;
  flush: () => void; // run the pending call now (e.g. on blur / submit)
}

// setup() runs once, so `fn` can read reactive state directly — no ref dance
// to dodge stale closures like React's useDebouncedCallback needs.
export function useDebounceFn<A extends unknown[]>(fn: (...args: A) => void, delayMs = 300): DebouncedFn<A> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: A | undefined;

  const cancel = () => {
    clearTimeout(timer);
    pending = undefined;
  };
  const flush = () => {
    const args = pending;
    cancel();
    if (args) fn(...args);
  };
  const debounced = (...args: A) => {
    pending = args;
    clearTimeout(timer);
    timer = setTimeout(flush, delayMs);
  };

  onScopeDispose(cancel, true); // never fire into an unmounted component
  return Object.assign(debounced, { cancel, flush });
}
