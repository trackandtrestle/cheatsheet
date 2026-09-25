import { describe, expect, it } from 'vitest';
import { formatEntries, insertionOrder, mapValues, sortByValue, toMap, toObject } from './mapIteration';

describe('Map iteration & conversion', () => {
  it('keeps insertion order even when a key is overwritten', () => {
    expect(insertionOrder()).toEqual(['b', 'a']);
  });

  it('iterates [key, value] pairs', () => {
    expect(formatEntries(new Map([['x', 1], ['y', 2]]))).toEqual(['x=1', 'y=2']);
  });

  it('round-trips through Object.entries / Object.fromEntries', () => {
    const m = toMap({ a: 1, b: 2 });
    expect(m.get('b')).toBe(2);
    expect(toObject(m)).toEqual({ a: 1, b: 2 });
  });

  it('maps values and sorts into a new Map', () => {
    const m = new Map([['a', 1], ['b', 3], ['c', 2]]);
    expect([...mapValues(m, (v) => v * 10)]).toEqual([['a', 10], ['b', 30], ['c', 20]]);
    expect([...sortByValue(m).keys()]).toEqual(['b', 'c', 'a']);
    expect([...m.keys()]).toEqual(['a', 'b', 'c']); // original untouched
  });
});
