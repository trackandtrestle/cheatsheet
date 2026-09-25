import { describe, expect, it } from 'vitest';
import { brokenGrid, cellOr, makeGrid, makeGridWith } from './grid2d';

describe('safe 2D init', () => {
  it('fill([]) shares one array across rows', () => {
    const g = brokenGrid(3);
    g[0]?.push(1);
    expect(g).toEqual([[1], [1], [1]]);
    expect(g[0]).toBe(g[2]);
  });
  it('Array.from creates independent rows', () => {
    const g = makeGrid(2, 2, 0);
    g[0]?.splice(0, 1, 9);
    expect(g).toEqual([[9, 0], [0, 0]]);
  });
  it('per-cell factory and safe reads', () => {
    const g = makeGridWith(2, 3, (r, c) => r * 3 + c);
    expect(g).toEqual([[0, 1, 2], [3, 4, 5]]);
    expect(cellOr(g, 1, 2, -1)).toBe(5);
    expect(cellOr(g, 5, 0, -1)).toBe(-1);
  });
});
