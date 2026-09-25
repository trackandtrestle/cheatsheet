import { describe, expect, it } from 'vitest';
import { chunk, chunkFrom } from './chunk';

describe('chunk', () => {
  it('splits into fixed-size groups', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunkFrom([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([], 3)).toEqual([]);
  });
  it('rejects size 0 (would loop forever)', () => {
    expect(() => chunk([1], 0)).toThrow(RangeError);
  });
});
