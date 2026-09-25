import { describe, expect, it } from 'vitest';
import { makeRangeSum, prefixSums, runningTotal } from './prefixSums';

describe('prefix sums', () => {
  it('builds the prefix array', () => {
    expect(prefixSums([3, 1, 4])).toEqual([0, 3, 4, 8]);
    expect(runningTotal([3, 1, 4])).toEqual([3, 4, 8]);
  });
  it('answers range queries in O(1)', () => {
    const sum = makeRangeSum([3, 1, 4, 1, 5]);
    expect(sum(0, 5)).toBe(14);
    expect(sum(1, 3)).toBe(5);
    expect(sum(2, 2)).toBe(0);
    expect(() => sum(3, 1)).toThrow(RangeError);
  });
});
