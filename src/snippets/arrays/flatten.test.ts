import { describe, expect, expectTypeOf, it } from 'vitest';
import { flattenDeep, flattenDepth, fully, once } from './flatten';

describe('flatten', () => {
  it('flat(depth)', () => {
    expect(once).toEqual([1, 2, [3, [4]]]);
    expect(fully).toEqual([1, 2, 3, 4]);
  });
  it('typed recursive flatten', () => {
    const r = flattenDeep<number>([1, [2, [3, [4]]], 5]);
    expectTypeOf(r).toEqualTypeOf<number[]>();
    expect(r).toEqual([1, 2, 3, 4, 5]);
  });
  it('explicit depth with a stack', () => {
    expect(flattenDepth([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
    expect(flattenDepth([[]], 1)).toEqual([]);
  });
});
