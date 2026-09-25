// Dedupe objects by a key using a Map. Two policies:

// Keep LAST: later entries overwrite. Order = first time each key was seen.
export function uniqueByKeepLast<T, K>(xs: readonly T[], key: (x: T) => K): T[] {
  return [...new Map(xs.map((x) => [key(x), x] as const)).values()];
}

// Keep FIRST: only insert if the key is new.
export function uniqueByKeepFirst<T, K>(xs: readonly T[], key: (x: T) => K): T[] {
  const seen = new Map<K, T>();
  for (const x of xs) if (!seen.has(key(x))) seen.set(key(x), x);
  return [...seen.values()];
}

// Composite keys: objects/arrays compare by reference, so build a string key.
export interface Row {
  city: string;
  day: string;
  temp: number;
}
export const latestPerCityDay = (rows: Row[]): Row[] =>
  uniqueByKeepLast(rows, (r) => `${r.city}|${r.day}`);
