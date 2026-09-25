import { describe, expect, expectTypeOf, it } from 'vitest';
import { ordersUrl, toCents, toOrderId, toUserId } from './branded';
import type { Cents, UserId } from './branded';

describe('branded types', () => {
  it('validates at the boundary', () => {
    const id = toUserId('u_42');
    expect(ordersUrl(id)).toBe('/users/u_42/orders');
    expect(() => toUserId('42')).toThrow('Invalid user id');
    expect(toCents(19.99)).toBe(1999);
  });

  it('prevents mixing structurally identical types', () => {
    // @ts-expect-error — a plain string is not a UserId
    ordersUrl('u_42');
    // @ts-expect-error — an OrderId is not a UserId
    ordersUrl(toOrderId('o_1'));
    // @ts-expect-error — number is not Cents
    const price: Cents = 1999;
    void price;
    // A brand still widens to its base type.
    expectTypeOf<UserId>().toExtend<string>();
    expectTypeOf<string>().not.toExtend<UserId>();
  });
});
