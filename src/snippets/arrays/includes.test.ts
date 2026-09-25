import { describe, expect, it } from 'vitest';
import { hasNaNIncludes, hasNaNIndexOf, hasPoint, isStatus } from './includes';

describe('includes vs indexOf', () => {
  it('includes finds NaN, indexOf does not', () => {
    expect(hasNaNIncludes([1, Number.NaN])).toBe(true);
    expect(hasNaNIndexOf([1, Number.NaN])).toBe(false);
  });
  it('compares objects by reference', () => {
    const p = { x: 1 };
    expect(hasPoint([p], p)).toBe(true);
    expect(hasPoint([p], { x: 1 })).toBe(false);
  });
  it('narrows a string to a union', () => {
    expect(isStatus('draft')).toBe(true);
    expect(isStatus('nope')).toBe(false);
  });
});
