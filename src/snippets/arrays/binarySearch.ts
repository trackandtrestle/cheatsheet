// lowerBound: first index i where xs[i] >= target (xs sorted ascending).
// Returns xs.length if every item is smaller. Also the insertion point.
export function lowerBound<T>(
  xs: readonly T[],
  target: T,
  cmp: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0),
): number {
  let lo = 0;
  let hi = xs.length; // half-open [lo, hi)
  while (lo < hi) {
    const mid = (lo + hi) >>> 1; // no overflow, floors
    const v = xs[mid] as T; // mid < hi <= length, so it exists
    if (cmp(v, target) < 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// Exact lookup built on lowerBound.
export function indexOfSorted(xs: readonly number[], target: number): number {
  const i = lowerBound(xs, target);
  return xs[i] === target ? i : -1;
}

// Insert while keeping order (immutable).
export const insertSorted = (xs: readonly number[], x: number): number[] =>
  xs.toSpliced(lowerBound(xs, x), 0, x);
