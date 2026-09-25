import { useEffect, useRef } from 'react';

// Dan Abramov's declarative interval: the latest callback lives in a ref, so
// the interval is NOT reset on every render and never sees stale state.
// Pass `null` as the delay to pause.
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Usage:
//   const [count, setCount] = useState(0);
//   useInterval(() => setCount(count + 1), running ? 1000 : null); // no stale `count`
