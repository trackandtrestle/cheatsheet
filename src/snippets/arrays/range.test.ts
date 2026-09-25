import { describe, expect, it } from 'vitest';
import { filled, holes, letters, range, squares } from './range';

describe('range / Array.from', () => {
  it('generates items', () => {
    expect(squares(4)).toEqual([0, 1, 4, 9]);
    expect(letters).toEqual(['A', 'B', 'C']);
  });
  it('range with step', () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
    expect(range(10, 0, -3)).toEqual([10, 7, 4, 1]);
    expect(range(5, 0)).toEqual([]);
  });
  it('map skips holes', () => {
    expect(0 in holes).toBe(false);
    expect(filled).toEqual([0, 1, 2]);
  });
});
