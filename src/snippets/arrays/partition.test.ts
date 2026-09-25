import { describe, expect, expectTypeOf, it } from 'vitest';
import { partition, splitMixed } from './partition';

describe('partition', () => {
  it('splits by a boolean predicate', () => {
    expect(partition([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual([[2, 4], [1, 3]]);
  });
  it('narrows with a type guard', () => {
    const [s, n] = partition(['a', 1], (x): x is string => typeof x === 'string');
    expectTypeOf(s).toEqualTypeOf<string[]>();
    expectTypeOf(n).toEqualTypeOf<number[]>();
    expect(splitMixed(['a', 1, 'b', 2])).toEqual({ upper: ['A', 'B'], total: 3 });
  });
});
