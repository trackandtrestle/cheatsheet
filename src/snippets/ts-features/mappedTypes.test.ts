import { describe, expect, expectTypeOf, it } from 'vitest';
import { makeGetters } from './mappedTypes';
import type { Concrete, Getters, Mutable, Nullable, PickByValue } from './mappedTypes';

interface Person {
  readonly id: number;
  name: string;
  nickname?: string;
  greet: () => string;
}

describe('mapped types', () => {
  it('transforms each property', () => {
    expectTypeOf<Nullable<{ a: string }>>().toEqualTypeOf<{ a: string | null }>();
  });

  it('adds or removes modifiers', () => {
    const m: Mutable<Person> = { id: 1, name: 'a', greet: () => '' };
    m.id = 2; // allowed: readonly removed
    const p: Person = m;
    // @ts-expect-error — id is readonly on Person
    p.id = 3;
    // @ts-expect-error — `-?` made nickname required
    const c: Concrete<Person> = { id: 1, name: 'a', greet: () => '' };
    void c;
  });

  it('remaps and filters keys with `as`', () => {
    expectTypeOf<keyof Getters<{ name: string; age: number }>>().toEqualTypeOf<'getName' | 'getAge'>();
    expectTypeOf<PickByValue<Person, string>>().toEqualTypeOf<{ name: string }>();
    const getters = makeGetters({ name: 'Ada', age: 36 });
    expectTypeOf(getters.getAge).returns.toEqualTypeOf<number>();
    expect(getters.getName()).toBe('Ada');
    expect(getters.getAge()).toBe(36);
  });
});
