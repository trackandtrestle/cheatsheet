import { describe, expectTypeOf, it } from 'vitest';
import type {
  ElementOf, FirstArg, Head, IsArray, PropsOf, Tail, ToNumber, UnwrapPromise,
} from './conditionalInfer';

describe('conditional types + infer', () => {
  it('branches on assignability', () => {
    expectTypeOf<IsArray<string[]>>().toEqualTypeOf<true>();
    expectTypeOf<IsArray<string>>().toEqualTypeOf<false>();
  });

  it('captures pieces with infer', () => {
    expectTypeOf<ElementOf<readonly ('a' | 'b')[]>>().toEqualTypeOf<'a' | 'b'>();
    expectTypeOf<ElementOf<string>>().toBeNever();
    expectTypeOf<UnwrapPromise<Promise<Promise<Date>>>>().toEqualTypeOf<Date>();
    expectTypeOf<Head<[1, 2, 3]>>().toEqualTypeOf<1>();
    expectTypeOf<Tail<[1, 2, 3]>>().toEqualTypeOf<[2, 3]>();
    expectTypeOf<FirstArg<(id: string, n: number) => void>>().toEqualTypeOf<string>();
    expectTypeOf<ToNumber<'42'>>().toEqualTypeOf<42>();
    expectTypeOf<ToNumber<'abc'>>().toBeNever();
    expectTypeOf<PropsOf<(p: { title: string }) => null>>().toEqualTypeOf<{ title: string }>();
  });
});
