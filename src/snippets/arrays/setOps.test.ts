import { describe, expect, it } from 'vitest';
import { difference, differenceBy, intersection, symmetricDifference, union } from './setOps';

describe('array set operations', () => {
  const a = [1, 2, 3, 3];
  const b = [3, 4];
  it('intersection / difference keep order of a (and duplicates)', () => {
    expect(intersection(a, b)).toEqual([3, 3]);
    expect(difference(a, b)).toEqual([1, 2]);
  });
  it('union / symmetric difference', () => {
    expect(union(a, b)).toEqual([1, 2, 3, 4]);
    expect(symmetricDifference([1, 2], [2, 3])).toEqual([1, 3]);
  });
  it('by key for objects', () => {
    const before = [{ id: 1 }, { id: 2 }];
    expect(differenceBy(before, [{ id: 2 }], (x) => x.id)).toEqual([{ id: 1 }]);
    expect(difference(before, [{ id: 2 }])).toHaveLength(2);
  });
});
