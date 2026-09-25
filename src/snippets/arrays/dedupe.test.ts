import { describe, expect, it } from 'vitest';
import { unique, uniqueCount, uniqueIgnoreCase, uniqueSlow } from './dedupe';

describe('dedupe primitives', () => {
  it('keeps first occurrence in order', () => {
    expect(unique([3, 1, 3, 2, 1])).toEqual([3, 1, 2]);
  });
  it('SameValueZero semantics', () => {
    expect(uniqueCount([Number.NaN, Number.NaN, 0, -0])).toBe(2);
    expect(uniqueCount([{}, {}])).toBe(2);
  });
  it('indexOf version drops NaN', () => {
    expect(uniqueSlow([1, Number.NaN, 1])).toEqual([1]);
  });
  it('dedupes by normalized key', () => {
    expect(uniqueIgnoreCase(['Foo', 'foo', 'BAR', 'bar'])).toEqual(['Foo', 'BAR']);
  });
});
