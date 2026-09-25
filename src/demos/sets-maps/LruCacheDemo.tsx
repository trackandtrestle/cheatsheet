import { useReducer, useState } from 'react';
import { LruCache } from '../../snippets/sets-maps/lruCache';

const KEYS = ['A', 'B', 'C', 'D', 'E'] as const;

export function LruCacheDemo() {
  // The cache is a mutable class; bump a counter to rerender after each call.
  const [cache] = useState(() => new LruCache<string, number>(3));
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const [log, setLog] = useState('Capacity 3. Read keys to see recency order change.');

  const read = (key: string) => {
    const hit = cache.get(key);
    if (hit === undefined) {
      const evicted = cache.size === cache.capacity ? cache.keys()[0] : undefined;
      cache.set(key, key.charCodeAt(0));
      setLog(`miss ${key} → stored${evicted ? `, evicted ${evicted}` : ''}`);
    } else {
      setLog(`hit ${key} → moved to newest`);
    }
    rerender();
  };

  return (
    <div>
      <div className="demo-row" role="group" aria-label="Read key">
        {KEYS.map((k) => (
          <button key={k} type="button" className="btn btn-small" onClick={() => read(k)}>
            get({k})
          </button>
        ))}
      </div>
      <p>
        Oldest → newest: <span className="mono">[{cache.keys().join(', ')}]</span>
      </p>
      <p role="status" className="mono">{log}</p>
    </div>
  );
}
