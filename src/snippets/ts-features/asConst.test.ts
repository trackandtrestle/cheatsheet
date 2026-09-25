import { describe, expect, expectTypeOf, it } from 'vitest';
import { HTTP, ROLES, isRole, joinRoles, widened } from './asConst';
import type { HttpCode, Role } from './asConst';

describe('as const', () => {
  it('derives a union from a const array', () => {
    expectTypeOf<Role>().toEqualTypeOf<'admin' | 'editor' | 'viewer'>();
    expectTypeOf<HttpCode>().toEqualTypeOf<200 | 404>();
    expect(isRole('editor')).toBe(true);
    expect(isRole('root')).toBe(false);
    expect(joinRoles(ROLES)).toBe('admin, editor, viewer');
  });

  it('makes values readonly', () => {
    expectTypeOf(ROLES).toEqualTypeOf<readonly ['admin', 'editor', 'viewer']>();
    // Wrapped in never-called functions: as const is compile-time only (no freeze).
    // @ts-expect-error — readonly tuple has no push
    const push = () => ROLES.push('root');
    // @ts-expect-error — readonly property
    const assign = () => (HTTP.ok = 201);
    void push;
    void assign;
    const mutable = (xs: string[]) => xs.length;
    // @ts-expect-error — a readonly array is not assignable to string[]
    mutable(ROLES);
  });

  it('without as const, literals widen', () => {
    expectTypeOf(widened).toEqualTypeOf<{ method: string; roles: string[] }>();
  });
});
