import { useCallback, useEffect, useState } from 'react';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback; // SSR: no storage
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback; // corrupt JSON, or storage blocked (privacy mode)
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial)); // read once
  // Pass `initial` as a primitive or a stable reference.

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch { /* quota exceeded: keep in-memory value */ }
  }, [key, value]);

  // `storage` fires in OTHER tabs only, never in the tab that wrote.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(read(key, initial));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, initial]);

  const remove = useCallback(() => {
    window.localStorage.removeItem(key);
    setValue(initial);
  }, [key, initial]);

  return [value, setValue, remove] as const;
}
