import { describe, expect, it } from 'vitest';
import { longestUniqueRun, maxWindowSum } from './slidingWindow';

describe('sliding window', () => {
  it('fixed-size max sum', () => {
    expect(maxWindowSum([2, 1, 5, 1, 3, 2], 3)).toBe(9);
    expect(maxWindowSum([-3, -1, -2], 1)).toBe(-1);
    expect(maxWindowSum([1, 2], 3)).toBeUndefined();
  });
  it('variable window', () => {
    expect(longestUniqueRun('abcabcbb')).toBe(3);
    expect(longestUniqueRun('abba')).toBe(2);
    expect(longestUniqueRun('')).toBe(0);
  });
});
