import { describe, expect, expectTypeOf, it } from 'vitest';
import { annotated, href, palette, routes } from './satisfies';
import type { Route, RouteName } from './satisfies';

describe('satisfies vs annotation', () => {
  it('annotation widens to the declared type', () => {
    expectTypeOf<keyof typeof annotated>().toEqualTypeOf<string>();
    expectTypeOf(annotated.admin).toEqualTypeOf<Route | undefined>();
  });

  it('satisfies keeps the precise inferred type', () => {
    expectTypeOf<RouteName>().toEqualTypeOf<'home' | 'admin'>();
    expectTypeOf(routes.admin.auth).toEqualTypeOf<true>(); // boolean literal kept
    expectTypeOf(routes.admin.path).toEqualTypeOf<string>();
    expectTypeOf(palette.primary).toEqualTypeOf<'#3b82f6'>();
    expect(href('admin')).toBe('/admin');
    // @ts-expect-error — not a known route name
    const typo = () => href('settings');
    void typo;
  });

  it('still validates the value', () => {
    // @ts-expect-error — path must be a string
    const bad = { home: { path: 1 } } satisfies Record<string, Route>;
    void bad;
  });
});
