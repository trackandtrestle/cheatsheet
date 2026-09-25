import { describe, expect, expectTypeOf, it } from 'vitest';
import { errorMessage, isApiError, onlyStrings } from './typeGuards';
import type { ApiError } from './typeGuards';

describe('type guards (x is T)', () => {
  it('checks at runtime', () => {
    expect(isApiError({ code: 404, message: 'Not found' })).toBe(true);
    expect(isApiError({ code: '404', message: 'Not found' })).toBe(false);
    expect(isApiError(null)).toBe(false);
    expect(errorMessage({ code: 500, message: 'Oops' })).toBe('500: Oops');
    expect(errorMessage(new Error('boom'))).toBe('boom');
    expect(onlyStrings([1, 'a', null, 'b'])).toEqual(['a', 'b']);
  });

  it('narrows at compile time', () => {
    const value: unknown = { code: 1, message: 'm' };
    // @ts-expect-error — unknown cannot be read before narrowing
    void value.code;
    if (isApiError(value)) expectTypeOf(value).toEqualTypeOf<ApiError>();
  });
});
