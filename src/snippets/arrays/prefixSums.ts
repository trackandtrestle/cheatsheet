// prefix[i] = sum of xs[0..i). One extra leading 0 removes edge cases.
export function prefixSums(xs: readonly number[]): number[] {
  const prefix = [0];
  let run = 0;
  for (const x of xs) prefix.push((run += x));
  return prefix;
}

// Sum of xs[from..to) in O(1) per query after O(n) setup.
export function makeRangeSum(xs: readonly number[]) {
  const p = prefixSums(xs);
  return (from: number, to: number): number => {
    if (from < 0 || to > xs.length || from > to) throw new RangeError('bad range');
    return (p[to] ?? 0) - (p[from] ?? 0);
  };
}

// Running total for charts: a scan, i.e. prefixSums without the leading 0.
export const runningTotal = (xs: readonly number[]): number[] => prefixSums(xs).slice(1);
