import { describe, expect, it } from 'vitest';
import { allPositive, canSubmit, hasAdmin, sumIfAllNumbers } from './someEvery';

describe('some / every', () => {
  it('some / every basics', () => {
    expect(hasAdmin(['user', 'admin'])).toBe(true);
    expect(allPositive([1, 2, -1])).toBe(false);
  });
  it('vacuous truth on empty arrays', () => {
    expect(allPositive([])).toBe(true);
    expect(hasAdmin([])).toBe(false);
    expect(canSubmit([])).toBe(false);
  });
  it('every narrows with a type guard', () => {
    expect(sumIfAllNumbers([1, 2, 3])).toBe(6);
    expect(sumIfAllNumbers([1, '2'])).toBeNull();
  });
});
