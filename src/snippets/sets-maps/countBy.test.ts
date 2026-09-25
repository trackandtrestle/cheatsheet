import { describe, expect, it } from 'vitest';
import { byLength, countBy, mostCommon } from './countBy';

describe('counting with Map', () => {
  it('counts occurrences', () => {
    const counts = countBy('mississippi', (ch) => ch);
    expect(Object.fromEntries(counts)).toEqual({ m: 1, i: 4, s: 4, p: 2 });
  });

  it('works with non-string keys', () => {
    const counts = countBy([1, 2, 3, 4, 5], (n) => n % 2 === 0);
    expect(counts.get(true)).toBe(2);
    expect(counts.get(false)).toBe(3);
  });

  it('finds the most common key (first wins ties)', () => {
    expect(mostCommon(countBy('mississippi', (c) => c))).toBe('i');
    expect(mostCommon(new Map())).toBeUndefined();
  });

  it('Map.groupBy groups by a computed key', () => {
    const g = byLength(['a', 'bb', 'cc', 'd']);
    expect(g.get(1)).toEqual(['a', 'd']);
    expect(g.get(2)).toEqual(['bb', 'cc']);
  });
});
