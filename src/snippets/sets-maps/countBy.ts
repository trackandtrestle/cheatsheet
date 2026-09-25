// Frequency count: `?? 0` handles the first sighting.
export function countBy<T, K>(items: Iterable<T>, keyOf: (item: T) => K): Map<K, number> {
  const counts = new Map<K, number>();
  for (const item of items) {
    const k = keyOf(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

// Most frequent key (first one wins on ties), or undefined for empty input.
export function mostCommon<K>(counts: ReadonlyMap<K, number>): K | undefined {
  let best: K | undefined;
  let max = 0;
  for (const [k, n] of counts) {
    if (n > max) [best, max] = [k, n];
  }
  return best;
}

// Grouping is built in (ES2024): Map.groupBy keeps non-string keys.
export const byLength = (words: string[]) => Map.groupBy(words, (w) => w.length);
