// Fixed-size window: max sum of any k consecutive items, O(n).
// Add the entering item, subtract the leaving one — no inner loop.
export function maxWindowSum(xs: readonly number[], k: number): number | undefined {
  if (k < 1 || k > xs.length) return undefined;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += xs[i] ?? 0;
  let best = sum;
  for (let i = k; i < xs.length; i++) {
    sum += (xs[i] ?? 0) - (xs[i - k] ?? 0);
    best = Math.max(best, sum);
  }
  return best;
}

// Variable window: length of the longest substring without repeats, O(n).
// Grow `right`; when the window becomes invalid, jump `left` forward.
export function longestUniqueRun(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s.charAt(right);
    const prev = lastSeen.get(ch);
    if (prev !== undefined && prev >= left) left = prev + 1;
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
