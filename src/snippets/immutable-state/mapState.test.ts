import { describe, expect, it } from 'vitest';
import { mapDelete, mapSet, mapUpdate } from './mapState';

describe('Map state helpers', () => {
  const prev: ReadonlyMap<string, number> = new Map([['apple', 1]]);

  it('mapSet copies', () => {
    const next = mapSet(prev, 'pear', 2);
    expect(next).not.toBe(prev);
    expect([...next]).toEqual([['apple', 1], ['pear', 2]]);
    expect(prev.size).toBe(1);
  });

  it('mapUpdate derives from the current value', () => {
    const inc = (n: number | undefined) => (n ?? 0) + 1;
    expect(mapUpdate(prev, 'apple', inc).get('apple')).toBe(2);
    expect(mapUpdate(prev, 'kiwi', inc).get('kiwi')).toBe(1);
    expect(prev.get('apple')).toBe(1);
  });

  it('mapDelete returns the same reference when the key is absent', () => {
    expect(mapDelete(prev, 'nope')).toBe(prev);
    const next = mapDelete(prev, 'apple');
    expect(next.size).toBe(0);
    expect(prev.size).toBe(1);
  });
});
