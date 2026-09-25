import { useCallback, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string, serverFallback = false): boolean {
  // Must be stable per query, or React re-subscribes on every render.
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches, // client snapshot (a primitive: safe)
    () => serverFallback, // SSR + hydration snapshot
  );
}
