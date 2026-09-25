import { describe, expect, expectTypeOf, it } from 'vitest';
import { pickRateLimiter, type Goal } from './whichRateLimiter';

describe('pickRateLimiter', () => {
  it('maps goals to strategies', () => {
    expect(pickRateLimiter('act when the user stops')).toBe('debounce (trailing)');
    expect(pickRateLimiter('act at a steady rate while it keeps happening')).toBe('throttle');
  });
  it('only accepts known goals', () => {
    expectTypeOf<'throttle please'>().not.toMatchTypeOf<Goal>();
    // @ts-expect-error unknown goal is a compile error (and would crash at runtime)
    expect(() => pickRateLimiter('throttle please')).toThrow(TypeError);
  });
});
