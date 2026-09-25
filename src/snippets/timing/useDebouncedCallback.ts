import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

export interface Debounced<A extends unknown[]> {
  (...args: A): void;
  cancel: () => void;
}

// Stable debounced function that always calls the LATEST callback.
export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delayMs: number,
): Debounced<A> {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Update after render commits, so an interrupted render can't leak a callback.
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const debounced = useMemo(() => {
    const cancel = () => clearTimeout(timerRef.current);
    const fn = (...args: A) => {
      cancel();
      timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
    };
    return Object.assign(fn, { cancel });
  }, [delayMs]);

  useEffect(() => debounced.cancel, [debounced]); // cancel on unmount
  return debounced;
}
