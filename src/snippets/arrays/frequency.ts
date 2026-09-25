// Count occurrences with a Map (any key type, insertion order preserved).
export function frequency<T>(xs: Iterable<T>): Map<T, number> {
  const counts = new Map<T, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  return counts;
}

// Most common item; undefined for empty input.
export function mode<T>(xs: Iterable<T>): T | undefined {
  let best: T | undefined;
  let bestCount = 0;
  for (const [x, n] of frequency(xs)) {
    if (n > bestCount) [best, bestCount] = [x, n];
  }
  return best;
}

// Record version for string keys. Beware a plain {} has inherited keys like
// "constructor": start from Object.create(null) or use a Map.
export function wordCounts(text: string): Record<string, number> {
  const counts: Record<string, number> = Object.create(null);
  for (const w of text.toLowerCase().match(/\w+/g) ?? []) counts[w] = (counts[w] ?? 0) + 1;
  return counts;
}
