import { describe, expect, expectTypeOf, it } from 'vitest';
import { parseConfig, safeLength, unsafeLength } from './unknownVsAny';

describe('unknown vs any', () => {
  it('any lets bugs through', () => {
    expect(unsafeLength(42)).toBeUndefined(); // typed as number, is undefined
  });

  it('unknown forces narrowing', () => {
    const value: unknown = 'abc';
    // @ts-expect-error — cannot access properties on unknown
    void value.length;
    expect(safeLength(value)).toBe(3);
    expect(safeLength([1, 2])).toBe(2);
    expect(safeLength(42)).toBe(0);
    expectTypeOf(JSON.parse('1')).toBeAny();
  });

  it('parses JSON safely', () => {
    expect(parseConfig('{"port":8080,"host":"localhost"}')).toEqual({ port: 8080, host: 'localhost' });
    expect(() => parseConfig('{"port":"8080","host":"x"}')).toThrow(TypeError);
    expect(() => parseConfig('null')).toThrow(TypeError);
  });
});
