import { describe, expect, it } from 'vitest';
import { frequency, mode, wordCounts } from './frequency';

describe('frequency count', () => {
  it('counts with a Map', () => {
    expect([...frequency('abca')]).toEqual([['a', 2], ['b', 1], ['c', 1]]);
  });
  it('finds the mode', () => {
    expect(mode([1, 2, 2, 3])).toBe(2);
    expect(mode([])).toBeUndefined();
  });
  it('null-prototype record handles "constructor"', () => {
    expect(wordCounts('The constructor, the END')).toEqual({ the: 2, constructor: 1, end: 1 });
  });
});
