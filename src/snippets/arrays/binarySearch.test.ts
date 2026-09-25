import { describe, expect, it } from 'vitest';
import { indexOfSorted, insertSorted, lowerBound } from './binarySearch';

describe('binary search (lower bound)', () => {
  const xs = [1, 3, 3, 3, 7];
  it('finds the first index >= target', () => {
    expect(lowerBound(xs, 3)).toBe(1);
    expect(lowerBound(xs, 4)).toBe(4);
    expect(lowerBound(xs, 0)).toBe(0);
    expect(lowerBound(xs, 99)).toBe(5);
    expect(lowerBound([], 1)).toBe(0);
  });
  it('exact lookup and insertion', () => {
    expect(indexOfSorted(xs, 7)).toBe(4);
    expect(indexOfSorted(xs, 5)).toBe(-1);
    expect(insertSorted(xs, 5)).toEqual([1, 3, 3, 3, 5, 7]);
  });
  it('custom comparator', () => {
    const words = ['apple', 'Banana', 'cherry'];
    expect(lowerBound(words, 'b', (a, b) => a.localeCompare(b, 'en'))).toBe(1);
  });
});
