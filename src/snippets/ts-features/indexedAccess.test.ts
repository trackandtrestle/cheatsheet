import { describe, expect, expectTypeOf, it } from 'vitest';
import { avatar, totalQty } from './indexedAccess';
import type { ApiResponse, Item, Profile, Size, UserOrItems, ValueOf } from './indexedAccess';

describe('indexed access types', () => {
  it('reads nested and element types', () => {
    expectTypeOf<Profile>().toEqualTypeOf<{ avatarUrl: string | null }>();
    expectTypeOf<Item>().toEqualTypeOf<{ sku: string; qty: number }>();
    expectTypeOf<UserOrItems>().toEqualTypeOf<ApiResponse['user'] | Item[]>();
    expectTypeOf<Size>().toEqualTypeOf<'sm' | 'md' | 'lg'>();
    expectTypeOf<ValueOf<{ a: 1; b: 'x' }>>().toEqualTypeOf<1 | 'x'>();
    // @ts-expect-error — no such property
    type Missing = ApiResponse['user']['email'];
  });

  it('works with runtime helpers', () => {
    expect(totalQty([{ sku: 'a', qty: 2 }, { sku: 'b', qty: 3 }])).toBe(5);
    expect(avatar({ avatarUrl: null })).toBe('/default-avatar.png');
  });
});
