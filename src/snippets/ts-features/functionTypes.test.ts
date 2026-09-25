import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { fetchUser, withRetry } from './functionTypes';
import type { FetchUserArgs, FetchUserResult } from './functionTypes';

describe('ReturnType / Parameters / Awaited', () => {
  it('derives argument and result types', () => {
    expectTypeOf<FetchUserArgs>().toEqualTypeOf<[id: string, opts?: { signal?: AbortSignal }]>();
    expectTypeOf<FetchUserResult>().toEqualTypeOf<{ id: string; name: string; createdAt: Date }>();
    expectTypeOf<Awaited<Promise<Promise<number>>>>().toEqualTypeOf<number>();
  });

  it('withRetry keeps the signature and retries', async () => {
    const flaky = vi.fn(fetchUser).mockRejectedValueOnce(new Error('boom'));
    const safeFetch = withRetry(flaky);
    expectTypeOf(safeFetch).parameters.toEqualTypeOf<FetchUserArgs>();
    expectTypeOf(safeFetch).returns.resolves.toEqualTypeOf<FetchUserResult>();
    await expect(safeFetch('42')).resolves.toMatchObject({ id: '42' });
    expect(flaky).toHaveBeenCalledTimes(2);
    // @ts-expect-error — id must be a string
    void safeFetch(42);
  });
});
