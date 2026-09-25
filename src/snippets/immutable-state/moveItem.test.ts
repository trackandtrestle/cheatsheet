import { describe, expect, it } from 'vitest';
import { moveById, moveItem, swap } from './moveItem';

describe('reordering', () => {
  const list = Object.freeze(['a', 'b', 'c', 'd']);

  it('moves forward and backward without mutating', () => {
    expect(moveItem(list, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(moveItem(list, 3, 0)).toEqual(['d', 'a', 'b', 'c']);
    expect(list).toEqual(['a', 'b', 'c', 'd']);
  });

  it('ignores out-of-range indexes', () => {
    expect(moveItem(list, 7, 0)).toBe(list);
    expect(moveItem(list, 1, 1)).toBe(list);
  });

  it('moveById returns the same reference at the edges', () => {
    const rows = [{ id: 'x' }, { id: 'y' }];
    expect(moveById(rows, 'y', -1).map((r) => r.id)).toEqual(['y', 'x']);
    expect(moveById(rows, 'x', -1)).toBe(rows);
    expect(moveById(rows, 'y', 1)).toBe(rows);
  });

  it('swaps two items', () => {
    expect(swap(list, 0, -1)).toEqual(['d', 'b', 'c', 'a']);
    expect(() => swap(list, 0, 10)).toThrow(RangeError);
  });
});
