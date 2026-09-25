import { describe, expect, it } from 'vitest';
import * as f from './setOpsFallback';

const cases: Array<[number[], number[]]> = [
  [[1, 2, 3], [2, 3, 4]],
  [[1, 2], [1, 2, 3]],
  [[], [1]],
  [[5, 6], [7]],
  [[1, 2, 3], [3, 2, 1]],
];

// Compare contents only: fallback intersection may iterate the smaller set first.
const sorted = (s: ReadonlySet<number>) => [...s].sort((x, y) => x - y);

describe('Set fallbacks match native ES2025 methods', () => {
  it.each(cases)('%j vs %j', (xs, ys) => {
    const a = new Set(xs);
    const b = new Set(ys);
    expect(sorted(f.union(a, b))).toEqual(sorted(a.union(b)));
    expect(sorted(f.intersection(a, b))).toEqual(sorted(a.intersection(b)));
    expect(sorted(f.difference(a, b))).toEqual(sorted(a.difference(b)));
    expect(sorted(f.symmetricDifference(a, b))).toEqual(sorted(a.symmetricDifference(b)));
    expect(f.isSubsetOf(a, b)).toBe(a.isSubsetOf(b));
    expect(f.isSupersetOf(a, b)).toBe(a.isSupersetOf(b));
    expect(f.isDisjointFrom(a, b)).toBe(a.isDisjointFrom(b));
  });

  it('does not mutate inputs', () => {
    const a = new Set([1, 2]);
    const b = new Set([2, 3]);
    f.union(a, b);
    f.symmetricDifference(a, b);
    expect([...a]).toEqual([1, 2]);
    expect([...b]).toEqual([2, 3]);
  });
});
