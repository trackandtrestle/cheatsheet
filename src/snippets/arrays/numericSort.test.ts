import { describe, expect, it } from 'vitest';
import { ascending, byBigInt, byDate, defaultSorted, descending, sortInPlaceTrap } from './numericSort';

describe('numeric sort', () => {
  it('default sort is lexicographic', () => {
    expect(defaultSorted).toEqual([1, 10, 2, 21]);
  });
  it('comparator sorts numerically', () => {
    expect(ascending([10, 1, 2])).toEqual([1, 2, 10]);
    expect(descending([10, 1, 2])).toEqual([10, 2, 1]);
  });
  it('sort mutates in place', () => {
    const xs = [3, 1, 2];
    expect(sortInPlaceTrap(xs)).toBe(true);
    expect(xs).toEqual([1, 2, 3]);
  });
  it('dates and bigints', () => {
    const [a, b] = [new Date(2024, 0, 2), new Date(2024, 0, 1)];
    expect(byDate([a, b])).toEqual([b, a]);
    expect(byBigInt([3n, 1n, 2n])).toEqual([1n, 2n, 3n]);
  });
});
