import { describe, expect, expectTypeOf, it } from 'vitest';
import { assertNever, describeState } from './discriminatedUnion';
import type { RequestState } from './discriminatedUnion';

describe('discriminated unions + assertNever', () => {
  it('narrows on the discriminant', () => {
    expect(describeState({ status: 'success', data: 42 })).toBe('Loaded 42');
    expect(describeState({ status: 'error', error: new Error('x') })).toBe('Failed: x');
    const s = { status: 'success', data: 1 } as RequestState<number>;
    if (s.status === 'success') expectTypeOf(s.data).toEqualTypeOf<number>();
  });

  it('flags a missing case at compile time', () => {
    function incomplete(s: RequestState<number>): string {
      switch (s.status) {
        case 'idle':
        case 'loading':
        case 'success':
          return s.status;
        default:
          // @ts-expect-error — the 'error' variant is unhandled, so s is not never
          return assertNever(s);
      }
    }
    // ...and throws at runtime if bad data slips through.
    expect(() => incomplete({ status: 'error', error: new Error() })).toThrow(/Unhandled variant/);
  });

  it('rejects impossible shapes', () => {
    // @ts-expect-error — `data` does not exist on the loading variant
    const bad: RequestState<number> = { status: 'loading', data: 1 };
    void bad;
  });
});
