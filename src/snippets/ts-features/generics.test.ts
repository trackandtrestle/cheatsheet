import { describe, expect, expectTypeOf, it } from 'vitest';
import { createMachine, defineRoles, longest, pluck } from './generics';
import type { Result } from './generics';

describe('generics: constraints and defaults', () => {
  it('keyof constraint links key and result type', () => {
    const names = pluck([{ id: 1, name: 'a' }], 'name');
    expectTypeOf(names).toEqualTypeOf<string[]>();
    expect(names).toEqual(['a']);
    // @ts-expect-error — 'email' is not a key
    pluck([{ id: 1 }], 'email');
  });

  it('structural constraints', () => {
    expect(longest('ab', 'abc')).toBe('abc');
    expect(longest([1, 2], [3])).toEqual([1, 2]);
    // @ts-expect-error — numbers have no length
    longest(1, 2);
  });

  it('defaults and const type parameters', () => {
    expectTypeOf<Result['data']>().toEqualTypeOf<unknown>();
    expectTypeOf<Result<number>['error']>().toEqualTypeOf<Error | undefined>();
    expectTypeOf(defineRoles(['admin', 'user'])).toEqualTypeOf<readonly ['admin', 'user']>();
  });

  it('NoInfer blocks inference from a parameter', () => {
    const m = createMachine(['idle', 'running'], 'idle');
    m.go('running');
    expect(m.state).toBe('running');
    expectTypeOf(m.state).toEqualTypeOf<'idle' | 'running'>();
    // @ts-expect-error — 'done' is not one of the states
    createMachine(['idle', 'running'], 'done');
  });
});
