import { describe, expect, expectTypeOf, it } from 'vitest';
import { compact, isPolygon } from './unionFilters';
import type { Circle, Polygon, Primitive, Shape } from './unionFilters';

describe('Extract / Exclude / NonNullable', () => {
  it('filters union members', () => {
    expectTypeOf<Circle>().toEqualTypeOf<{ kind: 'circle'; r: number }>();
    expectTypeOf<Polygon['kind']>().toEqualTypeOf<'square' | 'rect'>();
    expectTypeOf<Primitive>().toEqualTypeOf<string | number>();
    const shapes: Shape[] = [{ kind: 'circle', r: 1 }, { kind: 'square', size: 2 }];
    expect(shapes.filter(isPolygon)).toEqual([{ kind: 'square', size: 2 }]);
  });

  it('NonNullable strips null and undefined', () => {
    expectTypeOf<NonNullable<string | null | undefined>>().toEqualTypeOf<string>();
    const out = compact(['a', null, 'b', undefined]);
    expectTypeOf(out).toEqualTypeOf<string[]>();
    expect(out).toEqual(['a', 'b']);
  });
});
