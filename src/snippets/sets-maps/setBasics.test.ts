import { describe, expect, it } from 'vitest';
import { objectIdentity, sameValueZero, setBasics, unique } from './setBasics';

describe('Set basics', () => {
  it('drops duplicates and keeps insertion order', () => {
    expect(setBasics()).toEqual({ values: [1, 2, 4], size: 3, had: true, hasTwo: true });
  });

  it('uses SameValueZero (NaN === NaN, 0 === -0)', () => {
    expect(sameValueZero()).toBe(2);
  });

  it('compares objects by reference', () => {
    expect(objectIdentity()).toEqual({ size: 2, hasA: true, hasCopy: false });
  });

  it('unique() keeps first-seen order', () => {
    expect(unique(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c']);
  });
});
