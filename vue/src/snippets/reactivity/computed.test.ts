import { describe, expect, it } from 'vitest';
import { useSearch } from './computed';

describe('computed', () => {
  it('is lazy and cached', () => {
    const { query, matches, count, runs } = useSearch(['Vue', 'Vite', 'React']);
    expect(runs()).toBe(0); // nothing read yet

    expect(matches.value).toEqual(['Vue', 'Vite', 'React']);
    expect(count.value).toBe(3);
    expect(runs()).toBe(1); // second read hit the cache

    query.value = 'v';
    expect(runs()).toBe(1); // dirty, but not recomputed until read
    expect(matches.value).toEqual(['Vue', 'Vite']);
    expect(runs()).toBe(2);
  });
});
