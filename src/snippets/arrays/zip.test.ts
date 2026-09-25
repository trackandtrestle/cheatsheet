import { describe, expect, expectTypeOf, it } from 'vitest';
import { unzip, zip, zipAll } from './zip';

describe('zip', () => {
  it('pairs up and truncates', () => {
    const z = zip([1, 2, 3], ['a', 'b']);
    expectTypeOf(z).toEqualTypeOf<[number, string][]>();
    expect(z).toEqual([[1, 'a'], [2, 'b']]);
  });
  it('variadic zip keeps tuple types', () => {
    const z = zipAll([1, 2], ['a', 'b'], [true, false]);
    expectTypeOf(z).toEqualTypeOf<[number, string, boolean][]>();
    expect(z).toEqual([[1, 'a', true], [2, 'b', false]]);
  });
  it('unzips', () => {
    expect(unzip([[1, 'a'], [2, 'b']])).toEqual([[1, 2], ['a', 'b']]);
  });
});
