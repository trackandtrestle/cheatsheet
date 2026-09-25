import { describe, expect, it } from 'vitest';
import { oneLevel, parseInts, words } from './flatMap';

describe('flatMap', () => {
  it('expands items', () => {
    expect(words(['hello world', '  foo  '])).toEqual(['hello', 'world', 'foo']);
  });
  it('filters and maps in one pass', () => {
    expect(parseInts(['1', 'x', '42'])).toEqual([1, 42]);
  });
  it('only flattens one level', () => {
    expect(oneLevel).toEqual([[1, 10], [2, 20]]);
  });
});
