import { describe, expect, it, vi } from 'vitest';
import { Account, memoizeByObject } from './weakMap';

describe('WeakMap', () => {
  it('stores private data not visible on the instance', () => {
    const acct = new Account('s3cret');
    expect(acct.authHeader()).toBe('Bearer s3cret');
    expect(Object.keys(acct)).toEqual([]);
    expect(JSON.stringify(acct)).not.toContain('s3cret');
  });

  it('memoizes per object identity', () => {
    const total = vi.fn((xs: number[]) => xs.reduce((a, b) => a + b, 0));
    const memo = memoizeByObject(total);
    const list = [1, 2, 3];
    expect(memo(list)).toBe(6);
    expect(memo(list)).toBe(6);
    expect(total).toHaveBeenCalledTimes(1);
    memo([1, 2, 3]); // equal contents, different object -> recomputed
    expect(total).toHaveBeenCalledTimes(2);
  });

  it('rejects primitive keys', () => {
    const wm = new WeakMap<object, number>();
    // @ts-expect-error — keys must be objects (or non-registered symbols)
    expect(() => wm.set('str', 1)).toThrow(TypeError);
  });
});
