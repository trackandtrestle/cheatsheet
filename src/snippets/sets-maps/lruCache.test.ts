import { describe, expect, it } from 'vitest';
import { LruCache } from './lruCache';

describe('LruCache', () => {
  it('evicts the least recently used key', () => {
    const c = new LruCache<string, number>(2).set('a', 1).set('b', 2).set('c', 3);
    expect(c.keys()).toEqual(['b', 'c']);
    expect(c.get('a')).toBeUndefined();
  });

  it('get() refreshes recency', () => {
    const c = new LruCache<string, number>(2).set('a', 1).set('b', 2);
    expect(c.get('a')).toBe(1);
    c.set('c', 3); // evicts b, not a
    expect(c.keys()).toEqual(['a', 'c']);
  });

  it('set() on an existing key updates and refreshes without growing', () => {
    const c = new LruCache<string, number>(2).set('a', 1).set('b', 2).set('a', 10);
    expect(c.size).toBe(2);
    expect(c.keys()).toEqual(['b', 'a']);
    expect(c.get('a')).toBe(10);
  });

  it('has() does not refresh', () => {
    const c = new LruCache<string, number>(2).set('a', 1).set('b', 2);
    c.has('a');
    c.set('c', 3);
    expect(c.has('a')).toBe(false);
  });

  it('caches undefined values correctly and validates capacity', () => {
    const c = new LruCache<string, undefined>(1).set('x', undefined);
    expect(c.has('x')).toBe(true);
    expect(() => new LruCache(0)).toThrow(RangeError);
  });
});
