import { describe, expect, it } from 'vitest';
import type { Point } from './compositeKeys';
import { createInterner, PointSet, tupleKeyPitfall } from './compositeKeys';

describe('composite keys', () => {
  it('array keys compare by identity', () => {
    expect(tupleKeyPitfall()).toBe(false);
  });

  it('PointSet compares by value via a string key', () => {
    const s = new PointSet().add([0, 0]).add([1, 2]).add([0, 0]);
    expect(s.size).toBe(2);
    expect(s.has([1, 2])).toBe(true);
    expect(s.has([2, 1])).toBe(false);
  });

  it('interning makes equal values share a reference', () => {
    const intern = createInterner<Point>(([x, y]) => `${x},${y}`);
    const a = intern([3, 4]);
    const b = intern([3, 4]);
    expect(a).toBe(b);
    expect(new Set([a, b]).size).toBe(1);
  });
});
