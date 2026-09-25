import { describe, expect, it } from 'vitest';
import { MultiMap } from './multimap';

describe('MultiMap', () => {
  it('collects values per key in insertion order', () => {
    const mm = new MultiMap<string, number>().add('a', 1).add('b', 2).add('a', 3);
    expect(mm.get('a')).toEqual([1, 3]);
    expect([...mm.entries()]).toEqual([['a', [1, 3]], ['b', [2]]]);
  });

  it('returns an empty array for missing keys', () => {
    expect(new MultiMap<string, number>().get('nope')).toEqual([]);
  });

  it('removes values and drops empty buckets', () => {
    const mm = new MultiMap<string, number>().add('a', 1).add('a', 2);
    expect(mm.delete('a', 1)).toBe(true);
    expect(mm.delete('a', 99)).toBe(false);
    expect(mm.delete('a', 2)).toBe(true);
    expect(mm.keyCount).toBe(0);
  });
});
