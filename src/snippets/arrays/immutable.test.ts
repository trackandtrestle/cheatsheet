import { describe, expect, it } from 'vitest';
import * as m from './immutable';

describe('toSorted / toReversed / toSpliced / with', () => {
  it('returns new arrays', () => {
    expect(m.sorted).toEqual([1, 2, 3]);
    expect(m.reversed).toEqual([2, 1, 3]);
    expect(m.replaced).toEqual([3, 99, 2]);
    expect(m.removed).toEqual([1, 2]);
    expect(m.inserted).toEqual([3, 7, 8, 1, 2]);
    expect(m.lastReplaced).toEqual([3, 1, 0]);
  });
  it('leaves the original untouched', () => {
    expect(m.original).toEqual([3, 1, 2]);
  });
  it('with() throws on out-of-range index', () => {
    expect(() => [1].with(5, 0)).toThrow(RangeError);
  });
  it('toggles immutably', () => {
    const flags = [true, false];
    expect(m.toggleAt(flags, 1)).toEqual([true, true]);
    expect(flags).toEqual([true, false]);
    expect(m.toggleAt(flags, 9)).toEqual([true, false]);
  });
});
