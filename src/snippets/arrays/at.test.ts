import { describe, expect, it } from 'vitest';
import { initials, last, lastChar, lastOld } from './at';

describe('at()', () => {
  it('reads from the end', () => {
    expect(last([1, 2, 3])).toBe(3);
    expect(lastOld([1, 2, 3])).toBe(3);
    expect(last([])).toBeUndefined();
    expect(lastChar('abc')).toBe('c');
  });
  it('bracket access does not support negatives', () => {
    const xs = [1, 2, 3];
    expect(xs[-1]).toBeUndefined();
  });
  it('handles undefined without !', () => {
    expect(initials(['Ada', 'Grace', 'Linus'])).toBe('AL');
    expect(initials([])).toBe('??');
  });
});
