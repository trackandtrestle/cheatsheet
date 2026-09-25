// Overload 1: a type-guard predicate narrows BOTH halves.
export function partition<T, S extends T>(
  xs: readonly T[],
  pred: (x: T) => x is S,
): [S[], Exclude<T, S>[]];
// Overload 2: a plain boolean predicate.
export function partition<T>(xs: readonly T[], pred: (x: T) => boolean): [T[], T[]];
export function partition<T>(xs: readonly T[], pred: (x: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const x of xs) (pred(x) ? pass : fail).push(x);
  return [pass, fail];
}

// Usage: results are string[] and number[], not (string | number)[].
export function splitMixed(xs: (string | number)[]) {
  const [strs, nums] = partition(xs, (x): x is string => typeof x === 'string');
  return { upper: strs.map((s) => s.toUpperCase()), total: nums.reduce((a, b) => a + b, 0) };
}
