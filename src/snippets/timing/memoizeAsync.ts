// Cache async results per key for `ttlMs`. Concurrent calls share ONE in-flight
// promise, and failures are evicted so the next call retries.
export function memoizeAsync<K, V>(fn: (key: K) => Promise<V>, ttlMs: number) {
  const cache = new Map<K, { promise: Promise<V>; expires: number }>();

  return (key: K): Promise<V> => {
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.promise;

    const promise = fn(key);
    cache.set(key, { promise, expires: Date.now() + ttlMs });
    promise.catch(() => {
      // Only evict if a newer entry hasn't replaced ours in the meantime.
      if (cache.get(key)?.promise === promise) cache.delete(key);
    });
    return promise;
  };
}
