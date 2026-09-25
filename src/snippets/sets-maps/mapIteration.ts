// Maps iterate in insertion order; re-setting an existing key keeps its position.
export function insertionOrder() {
  const m = new Map<string, number>();
  m.set('b', 1).set('a', 2).set('b', 3); // 'b' stays first
  return [...m.keys()];
}

// Iterating: destructure entries directly.
export function formatEntries(m: ReadonlyMap<string, number>): string[] {
  const out: string[] = [];
  for (const [key, value] of m) out.push(`${key}=${value}`);
  return out;
}

// Object <-> Map conversion.
export const toMap = <V>(obj: Record<string, V>) => new Map(Object.entries(obj));
export const toObject = <V>(m: ReadonlyMap<string, V>) => Object.fromEntries(m);

// Transform values without leaving Map-land.
export function mapValues<K, V, R>(m: ReadonlyMap<K, V>, fn: (v: V, k: K) => R): Map<K, R> {
  return new Map([...m].map(([k, v]) => [k, fn(v, k)] as const));
}

// Sort by value: build a new Map from sorted entries.
export const sortByValue = (m: ReadonlyMap<string, number>) =>
  new Map([...m].sort(([, a], [, b]) => b - a));
