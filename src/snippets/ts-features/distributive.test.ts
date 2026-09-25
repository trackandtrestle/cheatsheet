import { describe, expect, expectTypeOf, it } from 'vitest';
import { createShape } from './distributive';
import type {
  BrokenShapeInput, IsNever, IsNeverBroken, MyExclude, ShapeInput, ToArray, ToArrayWhole,
} from './distributive';

describe('distributive conditional types', () => {
  it('distributes over naked type parameters', () => {
    expectTypeOf<ToArray<string | number>>().toEqualTypeOf<string[] | number[]>();
    expectTypeOf<ToArrayWhole<string | number>>().toEqualTypeOf<(string | number)[]>();
    expectTypeOf<MyExclude<'a' | 'b' | 'c', 'a'>>().toEqualTypeOf<'b' | 'c'>();
  });

  it('never distributes to never', () => {
    expectTypeOf<IsNeverBroken<never>>().toBeNever();
    expectTypeOf<IsNever<never>>().toEqualTypeOf<true>();
    expectTypeOf<IsNever<string>>().toEqualTypeOf<false>();
  });

  it('Omit on a union collapses it; DistributiveOmit keeps variants', () => {
    expectTypeOf<BrokenShapeInput>().toEqualTypeOf<{ kind: 'circle' | 'square' }>();
    expectTypeOf<ShapeInput>().toEqualTypeOf<{ kind: 'circle'; r: number } | { kind: 'square'; size: number }>();
    const s = createShape({ kind: 'circle', r: 2 });
    expect(s).toMatchObject({ kind: 'circle', r: 2 });
    expect(typeof s.id).toBe('string');
    // @ts-expect-error — circles have no size
    createShape({ kind: 'circle', size: 2 });
  });
});
