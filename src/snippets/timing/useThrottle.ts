import { useEffect, useRef, useState } from 'react';

// Throttled VALUE: updates at most once per `intervalMs` (leading + trailing),
// e.g. for scroll position or a live-resizing chart.
export function useThrottle<T>(value: T, intervalMs: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastUpdate = useRef(0);

  useEffect(() => {
    const commit = () => {
      lastUpdate.current = Date.now();
      setThrottled(value);
    };
    const wait = lastUpdate.current + intervalMs - Date.now();
    if (wait <= 0) {
      commit(); // leading edge: window is open
      return;
    }
    const id = setTimeout(commit, wait); // trailing edge: latest value wins
    return () => clearTimeout(id);
  }, [value, intervalMs]);

  return throttled;
}
