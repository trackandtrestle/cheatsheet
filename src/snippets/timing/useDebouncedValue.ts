import { useEffect, useState } from 'react';

// Returns `value` only after it has stopped changing for `delayMs`.
// Each change resets the timer via the effect cleanup.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

// Usage:
//   const [query, setQuery] = useState('');
//   const debouncedQuery = useDebouncedValue(query, 300);
//   useEffect(() => { void search(debouncedQuery); }, [debouncedQuery]);
