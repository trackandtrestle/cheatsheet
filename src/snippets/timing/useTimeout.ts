import { useCallback, useEffect, useRef } from 'react';

// Run `callback` once after `delay` ms (null = disabled). Changing the delay
// or calling `reset()` restarts the countdown; `clear()` cancels it.
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => clearTimeout(timerRef.current), []);

  const reset = useCallback(() => {
    clear();
    if (delay !== null) timerRef.current = setTimeout(() => savedCallback.current(), delay);
  }, [delay, clear]);

  useEffect(() => {
    reset();
    return clear;
  }, [reset, clear]);

  return { reset, clear };
}
