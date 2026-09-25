// Top-K by score: copy + sort + slice. O(n log n), fine for most UI data.
export function topK<T>(xs: readonly T[], k: number, score: (x: T) => number): T[] {
  return xs.toSorted((a, b) => score(b) - score(a)).slice(0, k);
}

// K most frequent items (ties keep first-seen order thanks to stable sort).
export function mostFrequent<T>(xs: Iterable<T>, k: number): [T, number][] {
  const counts = new Map<T, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  return [...counts].toSorted((a, b) => b[1] - a[1]).slice(0, k);
}

// Small k over huge n: keep a bounded sorted buffer, O(n·k), no full sort.
export function topKSmall(xs: Iterable<number>, k: number): number[] {
  const best: number[] = []; // descending
  for (const x of xs) {
    if (best.length === k && x <= (best.at(-1) ?? -Infinity)) continue;
    const i = best.findIndex((b) => x > b);
    best.splice(i === -1 ? best.length : i, 0, x);
    if (best.length > k) best.pop();
  }
  return best;
}
